'use server';

import db from '@/db/db';
import { expense } from '@/db/schema';
import { APIError } from '@/lib/exceptions';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newExpense = await db.insert(expense).values(body).returning();
    console.log('Successfully created expense log:', newExpense);

    return NextResponse.json(
      { message: 'Expense created successfully' },
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

    return NextResponse.json(
      { error: 'Failed to create expense log' },
      { status: 500 },
    );
  }
}
