import { Status } from '@/config/statusConfig';
import db from '@/db/db';
import { account, transaction } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { Account } from '@/lib/models';
import { createClient } from '@/utils/supabase/server';
import { and, desc, eq, SQL, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const activeStatus = Status.ACTIVE;

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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const sortBy = searchParams.get('sortBy');
    const sortOrder =
      searchParams.get('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      throw new APIError('Invalid parameters provided', 400);
    }

    const calcTotal = sql`
      COALESCE(
        SUM(
          CASE
            WHEN ${transaction.type} = 'income' THEN ${transaction.amount}
            WHEN ${transaction.type} = 'expense' THEN -${transaction.amount}
            ELSE 0
          END), 0)::numeric`.mapWith(Number);

    // Build filters
    const filters = [
      eq(account.userId, user.id),
      eq(account.statusId, activeStatus),
    ];
    // Filtering by type is not supported (no 'type' column in account)
    if (name) {
      // Case-insensitive substring search
      filters.push(
        sql`LOWER(${account.name}) LIKE '%' || LOWER(${name}) || '%'`,
      );
    }

    // Sorting: only allow certain fields
    let orderByClause = [];
    if (sortBy === 'total') {
      orderByClause =
        sortOrder === 'asc'
          ? [calcTotal]
          : [sql`${calcTotal} DESC` as SQL<number>];
    } else if (sortBy === 'name') {
      orderByClause =
        sortOrder === 'asc' ? [account.name] : [desc(account.name)];
    } else if (sortBy === 'createdAt') {
      orderByClause =
        sortOrder === 'asc' ? [account.createdAt] : [desc(account.createdAt)];
    } else if (sortBy === 'updatedAt') {
      orderByClause =
        sortOrder === 'asc' ? [account.updatedAt] : [desc(account.updatedAt)];
    } else {
      orderByClause = [desc(calcTotal), desc(account.createdAt)];
    }

    // Main paginated query
    const data: Partial<Account>[] = await db
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
        total: calcTotal,
      })
      .from(account)
      .leftJoin(
        transaction,
        and(
          eq(transaction.accountId, account.accountId),
          eq(transaction.statusId, activeStatus),
        ),
      )
      .where(and(...filters))
      .groupBy(account.accountId)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Count query for total items (without pagination)
    const countResult = await db
      .select({
        count: sql`COUNT(DISTINCT ${account.accountId})`.mapWith(Number),
      })
      .from(account)
      .leftJoin(
        transaction,
        and(
          eq(transaction.accountId, account.accountId),
          eq(transaction.statusId, activeStatus),
        ),
      )
      .where(and(...filters));

    const totalItems = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data,
      totalItems,
      totalPages,
    });
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
