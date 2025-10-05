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
  gt,
  gte,
  inArray,
  lt,
  lte,
  sql,
  sum,
} from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type TransactionType = 'income' | 'expense';
// E.g. THIS week, THIS month, etc
// If scope is provided, override start and end dates
type Scope = 'week' | 'month' | 'year' | 'all';
// E.g. day means every day within the time period, month means every month within the time period, grouped into days and months respectively
// type Granularity = 'day' | 'month' | 'year';
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Function to format date based on scope
const getDateExpression = (scope: Scope) => {
  switch (scope) {
    case 'week':
      // Format date as full date (YYYY-MM-DD) for grouping, but will also provide day name in response
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'YYYY-MM-DD')`;
    case 'month':
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'YYYY-MM-DD')`;
    case 'year':
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'Month')`;
    case 'all':
      return sql`to_char(${transaction.date}::timestamptz AT TIME ZONE ${sql.raw(`'${timezone}'`)}, 'YYYY')`;
    default:
      throw new Error(`Unsupported scope: ${scope}`);
  }
};

const fillEntries = async (
  startRange: Date,
  endRange: Date,
  data: Array<{
    totalAmount: number;
    totalIncome: number;
    totalExpense: number;
    date: unknown;
    transactionCount: number;
  }>,
) => {
  const filled = [];
  let previousTotal = 0;
  const now = new Date();
  while (startRange <= endRange) {
    // console.log(startRange.toLocaleDateString('en-CA'));
    const entry = data.find(
      (d) => d.date === startRange.toLocaleDateString('en-CA'),
    );
    // Hide future entries
    if (entry) {
      previousTotal = entry.totalAmount;
    }

    filled.push(
      entry || {
        date: startRange.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        totalAmount: startRange <= now ? previousTotal : 0,
        totalIncome: 0,
        totalExpense: 0,
        transactionCount: 0,
      },
    );
    startRange.setDate(startRange.getDate() + 1);
  }
  return filled;
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

  const query = db
    .select({
      totalAmount: sum(transaction.amount).mapWith(Number),
      date: scope ? getDateExpression(scope) : getDateExpression('month'),
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
    .groupBy(scope ? getDateExpression(scope) : getDateExpression('month'))
    .orderBy(
      asc(scope ? getDateExpression(scope) : getDateExpression('month')),
    );

  return await query;
};

const queryAllTransactions = async (
  scope: Scope,
  accountIds: string[] | null,
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

  const whereClause = [
    eq(account.userId, userId),
    eq(transaction.statusId, 1),
    gt(transaction.date, startDate),
    lte(transaction.date, endDate),
  ];
  // TODO: Fix account specific graph data
  if (accountIds) {
    whereClause.push(inArray(transaction.accountId, accountIds));
  }

  // Get all unique days in the range
  const dateExpr = scope
    ? getDateExpression(scope)
    : getDateExpression('month');
  const daysQuery = db
    .select({ date: dateExpr })
    .from(transaction)
    .innerJoin(account, eq(transaction.accountId, account.accountId))
    .where(and(...whereClause))
    .groupBy(dateExpr)
    .orderBy(asc(dateExpr));

  const days = await daysQuery;

  // For each day, calculate the running balance up to and including that day using Drizzle ORM methods
  const results: {
    totalAmount: number;
    totalIncome: number;
    totalExpense: number;
    date: unknown;
    transactionCount: number;
  }[] = [];

  let filledResults: {
    totalAmount: number;
    totalIncome: number;
    totalExpense: number;
    date: unknown;
    transactionCount: number;
  }[] = [];

  for (const day of days) {
    const dayValue = day.date;
    // Use Drizzle ORM's .sum() and .case() for running balance
    const runningBalanceQuery = await db
      .select({
        totalAmount: sum(
          sql`CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} ELSE -${transaction.amount} END`,
        ).mapWith(Number),
        totalIncome: sum(
          sql`CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} END`,
        ).mapWith(Number),
        totalExpense: sum(
          sql`CASE WHEN ${transaction.type} = 'expense' THEN ${transaction.amount} END`,
        ).mapWith(Number),
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
          ...[
            accountIds ? inArray(transaction.accountId, accountIds) : undefined,
          ],
          lte(
            scope ? getDateExpression(scope) : getDateExpression('month'),
            dayValue,
          ),
          lt(transaction.date, endDate),
        ),
      );

    results.push({
      totalAmount: runningBalanceQuery[0].totalAmount ?? 0,
      totalIncome: runningBalanceQuery[0].totalIncome ?? 0,
      totalExpense: runningBalanceQuery[0].totalExpense ?? 0,
      date: dayValue,
      transactionCount: runningBalanceQuery[0].transactionCount ?? 0,
    });

    if (scope === 'week' || scope === 'month') {
      filledResults = await fillEntries(
        new Date(startDate ?? Date.now()),
        new Date(endDate ?? Date.now()),
        results,
      );
    } else {
      filledResults = [...results];
    }
  }
  // Ensure an array is always returned
  return filledResults;
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
    const accountIdsParam = searchParams.get('accountIds');
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
      totalAmount: number;
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
        accountIdsParam
          ? accountIdsParam.split(',').map((id) => id.trim())
          : null,
        new Date(startDate ?? Date.now()),
        new Date(endDate ?? Date.now()),
        user.id,
      );
    }

    return NextResponse.json(entries, { status: 200 });
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
