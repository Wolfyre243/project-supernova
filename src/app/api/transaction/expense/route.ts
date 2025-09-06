'use server';

import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { parseScope } from '@/utils/parsers';
import { createClient } from '@/utils/supabase/server';
import { and, eq, gte, lt, sum } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse scope from query params
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'month';

    const { startDate, endDate, previousStartDate, previousEndDate } =
      parseScope(scope);

    // Fetch current period's total income
    const [currentExpenseQuery] = await db
      .select({
        totalExpense: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.type, 'expense'),
          eq(transaction.statusId, 1),
          gte(transaction.date, startDate), // Filter start of period
          lt(transaction.date, endDate), // Filter end of period (exclusive)
        ),
      );

    const currentExpense = currentExpenseQuery.totalExpense || 0;

    // Fetch previous period's total expense
    const [previousExpenseQuery] = await db
      .select({
        totalExpense: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.type, 'expense'),
          eq(transaction.statusId, 1),
          gte(transaction.date, previousStartDate),
          lt(transaction.date, previousEndDate),
        ),
      );

    const previousExpense = previousExpenseQuery.totalExpense || 0;

    // Calculate percentage difference
    let percentageDiff = 0;
    if (previousExpense !== 0) {
      percentageDiff =
        ((currentExpense - previousExpense) / previousExpense) * 100;
    } else if (currentExpense > 0) {
      percentageDiff = 100; // Treat as 100% increase if no previous expense
    }

    const expenseDifference = parseFloat(percentageDiff.toFixed(1));

    // TODO: Return raw data too for chart display, as well as past day/week/month/year data
    return NextResponse.json(
      { totalExpense: currentExpense, expenseDifference },
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
      { error: 'Failed to fetch expense summary' },
      { status: 500 },
    );
  }
}

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

    const newExpense = await db.insert(transaction).values(body).returning();

    await db
      .update(account)
      .set({ updatedAt: new Date() })
      .where(eq(account.accountId, body.accountId));

    console.log('Successfully created expense log:', newExpense);

    return NextResponse.json(
      { message: 'Expense created successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create expense log' },
      { status: 500 },
    );
  }
}
