'use server';

import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gte, lt, sum } from 'drizzle-orm';
import { parseGranularity } from '@/utils/parsers';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse granularity from query params
    const { searchParams } = new URL(request.url);
    const granularity = searchParams.get('granularity') || 'month';

    const { startDate, endDate, previousStartDate, previousEndDate } =
      parseGranularity(granularity);

    // Fetch current period's total income
    const [currentIncomeQuery] = await db
      .select({
        totalIncome: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.type, 'income'),
          eq(transaction.statusId, 1),
          gte(transaction.date, startDate), // Filter start of period
          lt(transaction.date, endDate), // Filter end of period (exclusive)
        ),
      );

    const currentIncome = currentIncomeQuery.totalIncome || 0;

    // Fetch previous period's total income
    const [previousIncomeQuery] = await db
      .select({
        totalIncome: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.type, 'income'),
          eq(transaction.statusId, 1),
          gte(transaction.date, previousStartDate),
          lt(transaction.date, previousEndDate),
        ),
      );

    const previousIncome = previousIncomeQuery.totalIncome || 0;

    // Calculate percentage difference
    let percentageDiff = 0;
    if (previousIncome !== 0) {
      percentageDiff =
        ((currentIncome - previousIncome) / previousIncome) * 100;
    } else if (currentIncome > 0) {
      percentageDiff = 100; // Treat as 100% increase if no previous income
    }

    const incomeDifference = parseFloat(percentageDiff.toFixed(1));

    // TODO: Return raw data too for chart display, as well as past day/week/month/year data
    return NextResponse.json(
      { totalIncome: currentIncome, incomeDifference },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch income summary' },
      { status: 500 },
    );
  }
}

// Create a new income entry
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // TODO: Body validation?

    const newIncome = await db.insert(transaction).values(body).returning();

    await db
      .update(account)
      .set({ updatedAt: new Date() })
      .where(eq(account.accountId, body.accountId));

    // TODO: Introduce a logging system
    console.log('Successfully created income log:', newIncome);

    return NextResponse.json(
      { message: 'Income created successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create income log' },
      { status: 500 },
    );
  }
}
