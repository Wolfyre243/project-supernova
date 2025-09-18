import db from '@/db/db';
import { account, category, transaction } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { Status } from '@/config/statusConfig';
import {
  and,
  eq,
  desc,
  inArray,
  getTableColumns,
  lte,
  gt,
  or,
  ilike,
} from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { APIError } from '@/lib/exceptions';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    const now = new Date();
    const { searchParams } = new URL(request.url);

    // Get Search Parameters
    // Filters
    const accountIdsParam = searchParams.get('accountIds');
    const categoryIdsParam = searchParams.get('categoryIds');
    const typeParam = searchParams.get('type');
    const searchTerm = searchParams.get('search') || '';

    // Pagination
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    // TODO: Implement sorting?
    // const sortBy = searchParams.get('sortBy');
    // const sortOrder =
    //   searchParams.get('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const startDateParam: string =
      searchParams.get('startDate') ||
      new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDateParam: string =
      searchParams.get('endDate') ||
      new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const groupBy = searchParams.get('groupBy');
    const whereClause = [
      eq(account.userId, user.id),
      eq(transaction.statusId, activeStatus),
      gt(transaction.date, new Date(startDateParam)),
      lte(transaction.date, new Date(endDateParam)),
      or(
        ilike(category.name, `%${searchTerm}%`),
        ilike(transaction.notes, `%${searchTerm}%`),
      ),
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

    // Filter by transaction type
    if (typeParam && (typeParam === 'income' || typeParam === 'expense')) {
      whereClause.push(eq(transaction.type, typeParam));
    }

    const query = db
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

    // Pagination logic
    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      if (!isNaN(pageNum) && !isNaN(limitNum)) {
        query.offset((pageNum - 1) * limitNum).limit(limitNum);
      }
    } else if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum)) {
        query.limit(limitNum);
      }
    }

    // Get total count for pagination (without limit/offset)
    const totalCountResult = await db
      .select()
      .from(transaction)
      .leftJoin(account, eq(transaction.accountId, account.accountId))
      .leftJoin(category, eq(transaction.categoryId, category.categoryId))
      .where(and(...whereClause));

    const totalCount = totalCountResult.length;

    const result = await query;

    const grouped: Record<string, typeof result> = {};
    // Check for groupBy=date parameter
    if (groupBy === 'date') {
      // Group transactions by date (YYYY-MM-DD)
      for (const transaction of result) {
        let dateKey = '';
        if (transaction.date) {
          const d = new Date(transaction.date);
          // Use toLocaleDateString with 'en-CA' for YYYY-MM-DD in Asia/Singapore
          dateKey = d.toLocaleDateString('en-CA', { timeZone });
        }
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(transaction);
      }
    }

    return NextResponse.json(
      {
        count: result.length,
        total: totalCount,
        transactions: Object.keys(grouped).length === 0 ? result : grouped,
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
