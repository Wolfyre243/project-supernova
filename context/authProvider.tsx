'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { createContext, useCallback, useLayoutEffect, useState } from 'react';
import { Roles } from '@/config/authConfig';
import LoadingSpinner from '@/components/loading-spinner';

export type AuthContextType = {
  userId: string | null | undefined;
  setUserId: (prev: string | null) => void;
  role: Roles | null | undefined;
  setRole: (prev: number | null) => void;
  loading: boolean;
  signOut: () => void;
};

const AuthContextInitState: AuthContextType = {
  userId: null,
  setUserId: () => {},
  role: null,
  setRole: () => {},
  loading: true,
  signOut: () => {},
};

const AuthContext = createContext<AuthContextType>(AuthContextInitState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  // const [user, setUser] = useState<User | null>();
  const [userId, setUserId] = useState<string | null>();
  const [role, setRole] = useState<Roles | null>();
  const [loading, setLoading] = useState(true);

  const setData = useCallback(async () => {
    // setLoading(true);

    try {
      const { data, error } = await supabase.auth.getClaims();
      const user_role = (
        data?.claims as { user_role?: Roles; sub?: string } | null
      )?.user_role;

      if (error) throw error;

      setUserId(data?.claims.sub);
      setRole(user_role);
    } catch (error) {
      console.log(error);
      setUserId(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useLayoutEffect(() => {
    setData();
    // const { data: listener } = supabase.auth.onAuthStateChange(() => {
    //   setData();
    // });
    // return () => {
    //   listener?.subscription.unsubscribe();
    // };
  }, [supabase]);

  const value = {
    userId,
    setUserId,
    role,
    setRole,
    loading,
    signOut: async () => {
      setUserId(null);
      setRole(null);
      await supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
