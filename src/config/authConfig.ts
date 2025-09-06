export enum Roles {
  USER = 1,
  ADMIN = 2,
  SUPERADMIN = 3,
}

export const PgRoles = {
  PUBLIC: 'public', // PgRoles.PUBLIC
  AUTHENTICATED: 'authenticated', // PgRoles.AUTHENTICATED
  SUPABASE_ADMIN: 'supabase_admin', // PgRoles.SUPABASE_ADMIN
  SUPABASE_AUTH_ADMIN: 'supabase_auth_admin', // PgRoles.SUPABASE_AUTH_ADMIN
  AUTHENTICATOR: 'authenticator', // PgRoles.AUTHENTICATOR
};
