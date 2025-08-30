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
  boolean,
  numeric,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { timestamps } from './columns.helpers';
import { PgRoles, Roles } from '@/config/authConfig';
import { Status } from '@/config/statusConfig';

const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const gender = pgEnum('gender', ['M', 'F']);
export const transactionType = pgEnum('transaction_type', [
  'income',
  'expense',
]);
export const frequency = pgEnum('frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export const status = pgTable(
  'status',
  {
    statusId: integer('status_id').primaryKey(),
    name: text().notNull(),
  },
  () => [
    pgPolicy('Enable read access for authenticated users', {
      as: 'permissive',
      for: 'select',
      to: [PgRoles.AUTHENTICATED, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
    pgPolicy('Allow only supabase_admin to insert statuses', {
      as: 'permissive',
      for: 'insert',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
    pgPolicy('Allow only supabase_admin to update statuses', {
      as: 'permissive',
      for: 'update',
      to: [PgRoles.SUPABASE_ADMIN, PgRoles.SUPABASE_AUTH_ADMIN],
    }),
  ],
);

export const profile = pgTable(
  'profile',
  {
    userId: uuid('user_id').primaryKey().notNull(),
    name: text().notNull(),
    dob: date(),
    gender: gender(),
    username: text().notNull(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
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
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    }),
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
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profile.userId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
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

export const account = pgTable(
  'account',
  {
    accountId: uuid('account_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    name: text().notNull(),
    description: text(),
    icon: text().notNull(),
    color: text().notNull(),
    isSavings: boolean('is_savings').notNull().default(false),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profile.userId],
      name: 'account_user_id_fkey',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own accounts', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`((select auth.uid()) = user_id)`,
      withCheck: sql`((select auth.uid()) = user_id)`,
    }),
  ],
);

export const category = pgTable(
  'category',
  {
    categoryId: uuid('category_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    name: text().notNull(),
    type: transactionType().notNull(),
    icon: text().notNull(),
    color: text().notNull(),
    description: text(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profile.userId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own categories', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`((select auth.uid()) = user_id)`,
      withCheck: sql`((select auth.uid()) = user_id)`,
    }),
  ],
);

export const income = pgTable(
  'income',
  {
    incomeId: uuid('income_id').primaryKey().defaultRandom(),
    accountId: uuid('account_id').notNull(),
    categoryId: uuid('category_id').notNull(),
    amount: numeric().notNull(),
    date: date().notNull().defaultNow(),
    notes: text(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.accountId],
      foreignColumns: [account.accountId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.categoryId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own income', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
    }),
  ],
);

export const expense = pgTable(
  'expense',
  {
    expenseId: uuid('expense_id').primaryKey().defaultRandom(),
    accountId: uuid('account_id').notNull(),
    categoryId: uuid('category_id').notNull(),
    amount: numeric().notNull(),
    date: date().notNull().defaultNow(),
    notes: text(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.accountId],
      foreignColumns: [account.accountId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.categoryId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own expenses', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
    }),
  ],
);

export const savingsGoal = pgTable(
  'savings_goal',
  {
    savingsGoalId: uuid('savings_goal_id').primaryKey().defaultRandom(),
    accountId: uuid('account_id').notNull(),
    name: text().notNull(),
    targetAmount: numeric('target_amount').notNull(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.accountId],
      foreignColumns: [account.accountId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own savings goals', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = ${table.accountId} AND 
          account.user_id = auth.uid()
      )`,
    }),
  ],
);

export const budget = pgTable(
  'budget',
  {
    budgetId: uuid('budget_id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id').notNull(),
    allocatedAmount: numeric('allocated_amount').notNull(),
    period: frequency().notNull().default('monthly'),
    description: text(),
    statusId: integer('status_id').notNull().default(Status.ACTIVE),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.categoryId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [status.statusId],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    pgPolicy('Users can manage their own budgets', {
      as: 'permissive',
      for: 'all',
      to: [PgRoles.AUTHENTICATED],
      using: sql`EXISTS (
        SELECT 1 FROM category
        WHERE
          category.category_id = ${table.categoryId} AND
          category.user_id = auth.uid()
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM category
        WHERE
          category.category_id = ${table.categoryId} AND
          category.user_id = auth.uid()
      )`,
    }),
  ],
);
