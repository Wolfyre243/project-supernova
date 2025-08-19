'use client';

import { createClient } from '@/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Roles } from '@/config/authConfig';
import { Loader2 } from 'lucide-react';

export type AuthContextType = {
  userId: string | null | undefined;
  role: Roles | null | undefined;
  signOut: () => void;
};

const AuthContextInitState: AuthContextType = {
  userId: null,
  role: null,
  signOut: () => {},
};

const AuthContext = createContext<AuthContextType>(AuthContextInitState);

export const AuthProvider = ({ children }: any) => {
  const supabase = createClient();
  // const [user, setUser] = useState<User | null>();
  const [userId, setUserId] = useState<string | null>();
  const [role, setRole] = useState<Roles | null>();
  const [loading, setLoading] = useState(false);

  const setData = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getClaims();
      console.log(data?.claims);
      const { user_role }: any = data?.claims ?? null;

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

  useEffect(() => {
    setData();
  }, []);

  const value = {
    userId,
    role,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className='flex flex-col justify-center items-center w-full h-screen'>
          <Loader2 className='animate-spin' size={64} strokeWidth={1} />
          <h1 className='text-xl'>Loading...</h1>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
