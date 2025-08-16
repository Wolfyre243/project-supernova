'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // TODO in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // TODO in practice, you should validate your inputs
  const data: SignUpWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      // TODO Get data from form instead
      data: {
        first_name: 'John',
        last_name: 'Doe',
        dob: '1990-01-15',
        // first_name: formData.get('firstName') as string,
        // last_name: formData.get('lastName') as string,
        // dob: formData.get('dob') as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  // TODO Can redirect to a "Check your email" page instead
  redirect('/auth/login');
}
