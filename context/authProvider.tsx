'use client';

import { createClient } from '@/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Roles } from '@/config/authConfig';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';

export type AuthContextType = {
  userId: string | null | undefined;
  role: Roles | null | undefined;
  loading: boolean;
  signOut: () => void;
};

const AuthContextInitState: AuthContextType = {
  userId: null,
  role: null,
  loading: true,
  signOut: () => {},
};

const AuthContext = createContext<AuthContextType>(AuthContextInitState);

export const AuthProvider = ({ children }: any) => {
  const supabase = createClient();
  // const [user, setUser] = useState<User | null>();
  const [userId, setUserId] = useState<string | null>();
  const [role, setRole] = useState<Roles | null>();
  const [loading, setLoading] = useState(true);

  const setData = useCallback(async () => {
    // setLoading(true);

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

  useLayoutEffect(() => {
    setData();
    // const { data: listener } = supabase.auth.onAuthStateChange(() => {
    //   setData();
    // });
    // return () => {
    //   listener?.subscription.unsubscribe();
    // };
  }, [supabase]);

  const value: AuthContextType = {
    userId,
    role,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
