import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  uuid,
  text,
  date,
  integer,
  pgEnum,
  pgSchema,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { timestamps } from './columns.helpers';
import { PgRoles, Roles } from '@/config/authConfig';

const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const gender = pgEnum('gender', ['M', 'F']);

export const profile = pgTable(
  'profile',
  {
    userId: uuid('user_id').primaryKey().notNull(),
    name: text().notNull(),
    dob: date(),
    gender: gender(),
    username: text().notNull(),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'profile_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('profile_username_key').on(table.username),
    pgPolicy('Users can update their own profile', {
      as: 'permissive',
      for: 'update',
      to: [PgRoles.PUBLIC],
      using: sql`((select auth.uid()) = user_id)`,
      withCheck: sql`((select auth.uid()) = user_id)`,
    }),
    pgPolicy('Allow auth admin to insert profiles', {
      as: 'permissive',
      for: 'insert',
      to: [PgRoles.SUPABASE_AUTH_ADMIN],
    }),
    pgPolicy('Users can insert their own profile', {
      as: 'permissive',
      for: 'insert',
      to: [PgRoles.AUTHENTICATED],
      withCheck: sql`((select auth.uid()) = user_id)`,
    }),
    pgPolicy('Public profiles are viewable by everyone', {
      as: 'permissive',
      for: 'select',
      to: [PgRoles.PUBLIC],
    }),
  ],
);

export const roles = pgTable(
  'roles',
  {
    roleId: integer('role_id').primaryKey().notNull(),
    name: text().notNull(),
    ...timestamps,
  },
  (table) => [
    unique('role_name_key').on(table.name),
    pgPolicy('Enable read access for authenticated users', {
      as: 'permissive',
      for: 'select',
      to: [
        PgRoles.AUTHENTICATED,
        PgRoles.SUPABASE_ADMIN,
        PgRoles.SUPABASE_AUTH_ADMIN,
      ],
    }),
    pgPolicy('Allow only supabase_admin to insert roles', {
      as: 'permissive',
      for: 'insert',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
    pgPolicy('Allow only supabase_admin to update roles', {
      as: 'permissive',
      for: 'update',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
  ],
);

export const userRole = pgTable(
  'user_role',
  {
    userId: uuid('user_id').notNull(),
    roleId: integer('role_id').notNull().default(Roles.USER),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.roleId],
    }),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.roleId],
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profile.userId],
    }),
    pgPolicy('Enable read access for authenticated users', {
      as: 'permissive',
      for: 'select',
      to: [
        // PgRoles.PUBLIC,
        PgRoles.AUTHENTICATED,
        PgRoles.SUPABASE_AUTH_ADMIN,
        PgRoles.SUPABASE_ADMIN,
      ],
    }),
    pgPolicy('Enable read access for authenticator (Supabase hooks)', {
      as: 'permissive',
      for: 'select',
      to: [PgRoles.AUTHENTICATOR],
    }),
    pgPolicy('Allow only supabase_admin to insert roles', {
      as: 'permissive',
      for: 'insert',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
    pgPolicy('Allow only supabase_admin to update roles', {
      as: 'permissive',
      for: 'update',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
  ],
);

// export const permissions = pgTable('permissions', {
//   permissionId: integer('permission_id').primaryKey().notNull(),
//   name: text().notNull().unique(),
//   ...timestamps,
// });

// export const rolePermissions = pgTable(
//   'role_permissions',
//   {
//     roleId: integer('role_id').notNull(),
//     permissionId: integer('permission_id').notNull(),
//     ...timestamps,
//   },
//   (table) => [
//     primaryKey({ columns: [table.roleId, table.permissionId] }),
//     foreignKey({
//       columns: [table.roleId],
//       foreignColumns: [roles.roleId],
//     }),
//     foreignKey({
//       columns: [table.permissionId],
//       foreignColumns: [permissions.permissionId],
//     }),
//   ],
// );
