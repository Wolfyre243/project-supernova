'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

import { generateUsername } from 'unique-username-generator';

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const username = generateUsername('', 8, 30);
  // type-casting here for convenience
  // TODO in practice, you should validate your inputs
  const data: SignUpWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      // TODO Get data from form instead
      data: {
        name: formData.get('name') as string,
        username,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error?.status && error.status >= 400) {
    console.log(error);
    return { error: error.message || 'An unexpected error occurred' };
  }

  revalidatePath('/', 'layout');
  // TODO Can redirect to a "Check your email" page instead
  redirect('/auth/login');
}
