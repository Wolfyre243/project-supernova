import db from '@/db/db';
import { account, transaction, category } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { Account } from '@/lib/models';
import { createClient } from '@/utils/supabase/server';
import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/account/[accountId]'>,
) {
  const { accountId } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const calcTotal = sql`
      COALESCE(
        SUM(
          CASE
            WHEN ${transaction.type} = 'income' THEN ${transaction.amount}
            WHEN ${transaction.type} = 'expense' THEN -${transaction.amount}
            ELSE 0
          END), 0)::numeric`.mapWith(Number);

    const [accountData] = await db
      .select({
        accountId: account.accountId,
        name: account.name,
        description: account.description,
        icon: account.icon,
        color: account.color,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        total: calcTotal,
        transactionCount: sql`COUNT(${transaction.transactionId})::int`.mapWith(
          Number,
        ),
      })
      .from(account)
      .where(and(eq(account.accountId, accountId), eq(account.userId, user.id)))
      .leftJoin(transaction, eq(account.accountId, transaction.accountId))
      .groupBy(account.accountId);

    // Aggregate total income for this account
    const [incomeTotal] = await db
      .select({
        total: sql`COALESCE(SUM(${transaction.amount}), 0)::numeric`.mapWith(
          Number,
        ),
      })
      .from(transaction)
      .where(
        and(
          eq(transaction.accountId, accountId),
          eq(transaction.type, 'income'),
        ),
      );

    const [expenseTotal] = await db
      .select({
        total: sql`COALESCE(SUM(${transaction.amount}), 0)::numeric`.mapWith(
          Number,
        ),
      })
      .from(transaction)
      .where(
        and(
          eq(transaction.accountId, accountId),
          eq(transaction.type, 'expense'),
        ),
      );

    // Get category distribution for income transactions
    const incomeCategoryDistribution = await db
      .select({
        name: category.name,
        categoryId: category.categoryId,
        count: sql`COUNT(*)::int`.mapWith(Number),
        color: category.color,
        icon: category.icon,
      })
      .from(transaction)
      .innerJoin(category, eq(transaction.categoryId, category.categoryId))
      .where(
        and(
          eq(transaction.accountId, accountId),
          eq(transaction.type, 'income'),
          eq(category.userId, user.id),
        ),
      )
      .groupBy(
        category.categoryId,
        category.name,
        category.color,
        category.icon,
      );

    const expenseCategoryDistribution = await db
      .select({
        name: category.name,
        categoryId: category.categoryId,
        count: sql`COUNT(*)::int`.mapWith(Number),
        color: category.color,
        icon: category.icon,
      })
      .from(transaction)
      .innerJoin(category, eq(transaction.categoryId, category.categoryId))
      .where(
        and(
          eq(transaction.accountId, accountId),
          eq(transaction.type, 'expense'),
          eq(category.userId, user.id),
        ),
      )
      .groupBy(
        category.categoryId,
        category.name,
        category.color,
        category.icon,
      );

    const accountIncomeData = {
      total: incomeTotal?.total || 0,
      categoryDistribution: incomeCategoryDistribution,
    };

    const accountExpenseData = {
      total: expenseTotal?.total || 0,
      categoryDistribution: expenseCategoryDistribution,
    };

    return NextResponse.json(
      {
        ...accountData,
        income: accountIncomeData,
        expense: accountExpenseData,
      },
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

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
