'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

import { generateUsername } from 'unique-username-generator';
import db from '@/db/db';
import { account, category } from '@/db/schema';
import { Account, Category } from '@/lib/models';

const initialAccounts = [
  // TODO: edit coloring and icons
  {
    name: 'Debit Card',
    icon: 'CreditCard',
    color: '#06b6d4',
  },
  {
    name: 'Savings',
    icon: 'PiggyBank',
    color: '#8b5cf6',
  },
];

// TODO: Add initial categories
const initialCategories = [
  {
    name: 'Food',
    type: 'expense' as 'income' | 'expense',
    icon: 'UtensilsCrossed',
    color: '#a855f7',
  },
  {
    name: 'Clothes',
    type: 'expense' as 'income' | 'expense',
    icon: 'Shirt',
    color: '#f43f5e',
  },
  {
    name: 'Salary',
    type: 'income' as 'income' | 'expense',
    icon: 'DollarSign',
    color: '#10b981',
  },
];

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const username = generateUsername('', 8, 30);
  // TODO: Add validation
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

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(data);

  if (user) {
    // Initialise user data here
    await db.insert(account).values(
      initialAccounts.map((acc) => ({
        ...acc,
        userId: user.id,
      })),
    );
    await db.insert(category).values(
      initialCategories.map((cat) => ({
        ...cat,
        userId: user.id,
      })),
    );
  } else if (error?.status && error.status >= 400) {
    console.log(error);
    return { error: error.message || 'An unexpected error occurred' };
  }

  revalidatePath('/', 'layout');
  // TODO Can redirect to a "Check your email" page instead
  redirect('/auth/login');
}
