'use server';

import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { parseGranularity } from '@/utils/parsers';
import { createClient } from '@/utils/supabase/server';
import { and, asc, eq, gte, lt, sql, sum } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type TransactionType = 'income' | 'expense';
type Granularity = 'week' | 'month' | 'year';

// Function to format date based on granularity
const getDateExpression = (granularity: Granularity) => {
  switch (granularity) {
    case 'week':
      // Format date as day name (e.g., 'Monday', 'Tuesday')
      return sql`to_char(${transaction.date}, 'Day')`;
    case 'month':
      // Format date as month name (e.g., 'January', 'February')
      return sql`to_char(${transaction.date}, 'Month')`;
    case 'year':
      // Format date as year (e.g., '2020', '2021')
      return sql`to_char(${transaction.date}, 'Year')`;
    default:
      throw new Error(`Unsupported granularity: ${granularity}`);
  }
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const granularity: Granularity =
      (searchParams.get('granularity') as Granularity) || 'month';
    const type: TransactionType =
      (searchParams.get('type') as TransactionType) || 'income';

    const { startDate, endDate } = parseGranularity(granularity);

    // Query to fetch all transactions by granularity
    const query = db
      .select({
        totalAmount: sum(transaction.amount).mapWith(Number),
        date: getDateExpression(granularity),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.type, type),
          eq(transaction.statusId, 1),
          gte(transaction.date, startDate),
          lt(transaction.date, endDate),
        ),
      )
      .groupBy(getDateExpression(granularity))
      .orderBy(asc(getDateExpression(granularity)));

    const entries = await query;

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}
