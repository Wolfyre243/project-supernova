// This route is purely for aggregated statistical data

'use server';

import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { parseScope } from '@/utils/parsers';
import { createClient } from '@/utils/supabase/server';
import {
  and,
  asc,
  countDistinct,
  eq,
  gte,
  lt,
  lte,
  sql,
  sum,
} from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type TransactionType = 'income' | 'expense';
// E.g. THIS week, THIS month, etc
// If scope is provided, override start and end dates
type Scope = 'day' | 'week' | 'month' | 'year';
// E.g. day means every day within the time period, month means every month within the time period, grouped into days and months respectively
// type Granularity = 'day' | 'month' | 'year';

// Function to format date based on scope
const getDateExpression = (scope: Scope) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  switch (scope) {
    case 'day':
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'YYYY-MM-DD')`;
    case 'week':
      // Format date as day name (e.g., 'Monday', 'Tuesday')
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'Day')`;
    case 'month':
      // Format date as month name (e.g., 'January', 'February')
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'Month')`;
    case 'year':
      // Format date as year (e.g., '2020', '2021')
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'YYYY')`;
    default:
      throw new Error(`Unsupported scope: ${scope}`);
  }
};

const queryTransactionsByType = async (
  type: TransactionType,
  scope: Scope,
  startDate: Date,
  endDate: Date,
  userId: string,
) => {
  // Scope overrides all
  if (scope) {
    const parsed = parseScope(scope);
    startDate = parsed.startDate;
    endDate = parsed.endDate;
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  console.log({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const query = db
    .select({
      totalAmount: sum(transaction.amount).mapWith(Number),
      date: scope ? getDateExpression(scope) : getDateExpression('day'),
      transactionCount: countDistinct(transaction.transactionId).mapWith(
        Number,
      ),
    })
    .from(transaction)
    .innerJoin(account, eq(transaction.accountId, account.accountId))
    .where(
      and(
        eq(account.userId, userId),
        eq(transaction.type, type),
        eq(transaction.statusId, 1),
        gte(transaction.date, startDate),
        lt(transaction.date, endDate),
      ),
    )
    .groupBy(scope ? getDateExpression(scope) : getDateExpression('day'))
    .orderBy(asc(scope ? getDateExpression(scope) : getDateExpression('day')));

  return await query;
};

const queryAllTransactions = async (
  scope: Scope,
  startDate: Date,
  endDate: Date,
  userId: string,
) => {
  // Scope overrides all
  if (scope) {
    const parsed = parseScope(scope);
    startDate = parsed.startDate;
    endDate = parsed.endDate;
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // Get all unique days in the range
  const dateExpr = scope ? getDateExpression(scope) : getDateExpression('day');
  const daysQuery = db
    .select({ date: dateExpr })
    .from(transaction)
    .innerJoin(account, eq(transaction.accountId, account.accountId))
    .where(
      and(
        eq(account.userId, userId),
        eq(transaction.statusId, 1),
        gte(transaction.date, startDate),
        lt(transaction.date, endDate),
      ),
    )
    .groupBy(dateExpr)
    .orderBy(asc(dateExpr));

  const days = await daysQuery;

  // For each day, calculate the running balance up to and including that day
  const results: {
    totalAmount: number;
    date: unknown;
    transactionCount: number;
  }[] = [];
  for (const day of days) {
    // For each day, get the max date value for that group
    const dayValue = day.date;
    // For the running balance, sum all transactions up to and including this day
    const runningBalanceQuery = await db
      .select({
        totalAmount: sql<number>`
          SUM(CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} ELSE -${transaction.amount} END)
        `,
        transactionCount: countDistinct(transaction.transactionId).mapWith(
          Number,
        ),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.accountId))
      .where(
        and(
          eq(account.userId, userId),
          eq(transaction.statusId, 1),
          lte(
            scope ? getDateExpression(scope) : getDateExpression('day'),
            dayValue,
          ),
          lt(transaction.date, endDate),
        ),
      );
    results.push({
      totalAmount: runningBalanceQuery[0].totalAmount ?? 0,
      date: dayValue,
      transactionCount: runningBalanceQuery[0].transactionCount ?? 0,
    });
  }
  return results;
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
    const scope: Scope = searchParams.get('scope') as Scope;
    const type: TransactionType = searchParams.get('type') as TransactionType;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!scope && (!startDate || !endDate)) {
      throw new APIError(
        'Either scope or both startDate and endDate must be provided',
        400,
      );
    }

    let entries: {
      totalAmount: number | null;
      date: unknown;
      transactionCount: number;
    }[] = [];

    if (type) {
      entries = await queryTransactionsByType(
        type,
        scope,
        new Date(startDate ?? Date.now()),
        new Date(endDate ?? Date.now()),
        user.id,
      );
    } else {
      entries = await queryAllTransactions(
        scope,
        new Date(startDate ?? Date.now()),
        new Date(endDate ?? Date.now()),
        user.id,
      );
    }

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
