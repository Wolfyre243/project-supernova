'use server';

import { Status } from '@/config/statusConfig';
import db from '@/db/db';
import { account, expense, income } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { createClient } from '@/utils/supabase/server';
import { and, eq, sum } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activeStatus = Status.ACTIVE;

    const [incomeSubquery] = await db
      .select({
        total: sum(income.amount).mapWith(Number),
      })
      .from(income)
      .leftJoin(
        account,
        and(
          eq(income.accountId, account.accountId),
          eq(income.statusId, activeStatus),
        ),
      )
      .where(
        and(eq(account.userId, user.id), eq(income.statusId, activeStatus)),
      );

    const [expenseSubquery] = await db
      .select({
        total: sum(expense.amount).mapWith(Number),
      })
      .from(expense)
      .leftJoin(
        account,
        and(
          eq(expense.accountId, account.accountId),
          eq(expense.statusId, activeStatus),
        ),
      )
      .where(
        and(eq(account.userId, user.id), eq(expense.statusId, activeStatus)),
      );

    const finalBalance =
      (incomeSubquery?.total || 0) - (expenseSubquery?.total || 0);

    return NextResponse.json({ balance: finalBalance }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user balance' },
      { status: 500 },
    );
  }
}
