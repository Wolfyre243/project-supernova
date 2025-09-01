'use server';

import { Status } from '@/config/statusConfig';
import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { Account } from '@/lib/models';
import { createClient } from '@/utils/supabase/server';
import { and, asc, desc, eq, sql, sum } from 'drizzle-orm';
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

    const result: Partial<Account>[] = await db
      .select({
        accountId: account.accountId,
        userId: account.userId,
        name: account.name,
        icon: account.icon,
        color: account.color,
        description: account.description,
        isSavings: account.isSavings,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        total:
          sql`
          COALESCE(
            SUM(
              CASE 
                WHEN ${transaction.type} = 'income' THEN ${transaction.amount} 
                WHEN ${transaction.type} = 'expense' THEN -${transaction.amount} 
                ELSE 0 
              END), 0)::numeric`.mapWith(Number) || 0,
      })
      .from(account)
      .leftJoin(
        transaction,
        and(
          eq(transaction.accountId, account.accountId),
          eq(transaction.statusId, activeStatus),
        ),
      )
      .where(
        and(eq(account.userId, user.id), eq(account.statusId, activeStatus)),
      )
      .groupBy(account.accountId)
      .orderBy(asc(account.isSavings), desc(account.createdAt));

    if (!result || result.length === 0) {
      throw new APIError('No accounts found for user', 404);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
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
