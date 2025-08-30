'use server';

import db from '@/db/db';
import { APIError } from '@/lib/exceptions';
import { Category } from '@/lib/models';
import { createClient } from '@/utils/supabase/server';
import { and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const transactionType = request.nextUrl.searchParams.get('type');

  try {
    if (
      transactionType &&
      transactionType !== 'income' &&
      transactionType !== 'expense'
    ) {
      throw new APIError('Invalid type provided', 400);
    }

    const result = await db.query.category.findMany({
      where: (category, { eq }) => {
        if (transactionType) {
          return and(
            eq(category.type, transactionType as 'income' | 'expense'),
            eq(category.userId, user.id),
          );
        }
        return eq(category.userId, user.id);
      },
      with: {
        status: {
          columns: {
            name: true,
          },
        },
      },
    });

    if (!result || result.length === 0) {
      throw new APIError('No categories found for user', 404);
    }

    const userCategories: Category[] = result.map((c) => ({
      ...c,
      status: c.status.name,
    }));

    return NextResponse.json(userCategories, { status: 200 });
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
