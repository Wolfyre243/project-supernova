// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// You may need to adjust the import path for your Drizzle client/database instance
import db from '@/db/db';

export async function GET() {
  // 1. Authenticate user via Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Query Drizzle for user profile, email, and role
  try {
    // Use Drizzle query API to get profile and join userRole and roles
    const userProfile = await db.query.profile.findFirst({
      where: (profile, { eq }) => eq(profile.userId, user.id),
      with: {
        userRole: {
          columns: {
            roleId: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Compose NavUserType response
    return NextResponse.json(
      {
        ...userProfile,
        email: user.email ?? '',
        role: userProfile.userRole?.roleId,
        // avatarUrl: null, // Not present in schema
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
