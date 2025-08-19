import RequireAuth from '@/components/require-auth';
import AccountForm from './account-form';
import { createClient } from '@/utils/supabase/server';
import { Roles } from '@/config/authConfig';

export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <RequireAuth allowedRoles={[Roles.USER]}>
        <AccountForm user={user} />;
      </RequireAuth>
    </>
  );
}
