'use server';

import db from '@/db/db';
import { APIError } from '@/lib/exceptions';
import { Account } from '@/lib/models';
import { createClient } from '@/utils/supabase/server';
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
    const result = await db.query.account.findMany({
      where: (account, { eq }) => eq(account.userId, user.id),
      with: {
        status: {
          columns: {
            name: true,
          },
        },
      },
    });

    if (!result || result.length === 0) {
      throw new APIError('No accounts found for user', 404);
    }

    const userAccounts: Account[] = result.map((a) => ({
      ...a,
      status: a.status.name,
    }));

    return NextResponse.json(userAccounts, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
