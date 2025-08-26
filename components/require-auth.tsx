'use client';

import { Roles } from '@/config/authConfig';
import useAuth from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from './loading-spinner';
import { UnauthorisedError } from '@/lib/exceptions';
import { toast } from 'sonner';

export default function RequireAuth({
  allowedRoles = [], // If no roles required, leave empty to allow all roles to access
  children,
}: {
  allowedRoles?: Array<Roles>;
  children: React.ReactNode;
}) {
  const { role, userId, loading } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  const checkAccess = useCallback(async () => {
    try {
      if (!userId || !role) {
        // throw new AuthRequiredError();
        toast.error('Please login to continue!');
        redirect('/auth/login');
      }
      if (
        !(allowedRoles.includes(role) || role === Roles.SUPERADMIN) &&
        allowedRoles.length > 0
      ) {
        throw new UnauthorisedError();
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [role, userId, allowedRoles]);

  useEffect(() => {
    if (loading) return;
    checkAccess();
  }, [role, userId, loading, checkAccess]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    throw error;
  }

  return <>{children}</>;
}
