import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');

  // Checks if user is coming from signup, inivte, etc
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    // Exchange TokenHash for a session, logging the user in
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error) {
      console.error(error);
      // TODO: Throw an error instead, and display the error on that page
      // return the user to an error page with some instructions
      return redirect('/error');
    }
  }

  revalidatePath('/home');
  return redirect('/home');
}
