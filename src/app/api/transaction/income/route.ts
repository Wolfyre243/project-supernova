'use server';

import db from '@/db/db';
import { income } from '@/db/schema';
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

    const newIncome = await db.insert(income).values(body).returning();
    console.log('Successfully created income log:', newIncome);

    return NextResponse.json(
      { message: 'Income created successfully' },
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
      { error: 'Failed to create income log' },
      { status: 500 },
    );
  }
}
