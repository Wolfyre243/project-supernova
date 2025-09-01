'use server';

import { Status } from '@/config/statusConfig';
import db from '@/db/db';
import { account, transaction } from '@/db/schema';
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
        total: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .leftJoin(
        account,
        and(
          eq(transaction.accountId, account.accountId),
          eq(account.statusId, activeStatus),
        ),
      )
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.statusId, activeStatus),
          eq(transaction.type, 'income'),
        ),
      );

    const [expenseSubquery] = await db
      .select({
        total: sum(transaction.amount).mapWith(Number),
      })
      .from(transaction)
      .leftJoin(
        account,
        and(
          eq(transaction.accountId, account.accountId),
          eq(account.statusId, activeStatus),
        ),
      )
      .where(
        and(
          eq(account.userId, user.id),
          eq(transaction.statusId, activeStatus),
          eq(transaction.type, 'expense'),
        ),
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
