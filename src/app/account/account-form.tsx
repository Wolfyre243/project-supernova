'use client';

import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import useAuth from '@/hooks/useAuth';

// ...

// TODO: Refactor
export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  // const [age, setAge] = useState<string | null>(null);
  const { userId, role } = useAuth();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profile')
        .select(`name, username`)
        .eq('user_id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFirstName(data.username);
        setLastName(data.name);
      }
    } catch (error) {
      console.log(error);
      // alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    firstName,
    lastName,
  }: {
    firstName: string | null;
    lastName: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profile').upsert({
        user_id: user?.id as string,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      // alert('Profile updated!');
    } catch (error) {
      console.log(error);
      // alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='form-widget h-screen w-full'>
      {/* ... */}
      <h1>Your id: {userId}</h1>
      <h1>Your role: {role}</h1>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='text' value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor='fullName'>First Name</label>
        <input
          id='fullName'
          type='text'
          value={firstName || ''}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='username'>Last Name</label>
        <input
          id='username'
          type='text'
          value={lastName || ''}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div>
        <button
          className='button primary block'
          onClick={() => updateProfile({ firstName, lastName })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action='/auth/signout' method='post'>
          <button className='button block' type='submit'>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
