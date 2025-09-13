import db from '@/db/db';
import { account, category, transaction } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { Status } from '@/config/statusConfig';
import { and, eq, desc, inArray, getTableColumns } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { APIError } from '@/lib/exceptions';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activeStatus = Status.ACTIVE;
    const url = new URL(request.url);
    const accountIdsParam = url.searchParams.get('accountIds');
    const categoryIdsParam = url.searchParams.get('categoryIds');
    const whereClause = [
      eq(account.userId, user.id),
      eq(transaction.statusId, activeStatus),
    ];

    // Filter by account ID
    if (accountIdsParam) {
      const accountIds = accountIdsParam.split(',').map((id) => id.trim());
      if (accountIds.length > 0) {
        whereClause.push(inArray(transaction.accountId, accountIds));
      }
    }

    // Filter by category ID
    if (categoryIdsParam) {
      const categoryIds = categoryIdsParam.split(',').map((id) => id.trim());
      if (categoryIds.length > 0) {
        whereClause.push(inArray(transaction.categoryId, categoryIds));
      }
    }

    // Filter by transaction type (?type=income or ?type=expense)
    const typeParam = url.searchParams.get('type');
    if (typeParam && (typeParam === 'income' || typeParam === 'expense')) {
      whereClause.push(eq(transaction.type, typeParam));
    }

    const result = await db
      .select({
        ...getTableColumns(transaction),
        accountName: account.name,
        accountIcon: account.icon,
        accountColor: account.color,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
      })
      .from(transaction)
      .leftJoin(account, eq(transaction.accountId, account.accountId))
      .leftJoin(category, eq(transaction.categoryId, category.categoryId))
      .where(and(...whereClause))
      .orderBy(desc(transaction.date));

    return NextResponse.json(
      {
        count: result.length,
        transactions: result,
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
