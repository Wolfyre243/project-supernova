import {
  pgTable,
  uniqueIndex,
  integer,
  varchar,
  foreignKey,
  unique,
  pgPolicy,
  uuid,
  text,
  date,
  timestamp,
  pgEnum,
  pgSchema,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const gender = pgEnum('gender', ['M', 'F']);

export const status = pgTable(
  'status',
  {
    statusId: integer('status_id').primaryKey().notNull(),
    statusName: varchar('status_name', { length: 30 }).notNull(),
  },
  (table) => [
    uniqueIndex('status_status_name_key').using(
      'btree',
      table.statusName.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const profile = pgTable(
  'profile',
  {
    userId: uuid('user_id').primaryKey().notNull(),
    name: text().notNull(),
    dob: date(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    gender: gender(),
    username: text().notNull(),
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
      to: ['public'],
      using: sql`(auth.uid() = user_id)`,
      withCheck: sql`(auth.uid() = user_id)`,
    }),
    pgPolicy('Allow auth admin to insert profiles', {
      as: 'permissive',
      for: 'insert',
      to: ['supabase_auth_admin'],
    }),
    pgPolicy('Users can insert their own profile', {
      as: 'permissive',
      for: 'insert',
      to: ['authenticated'],
    }),
    pgPolicy('Public profiles are viewable by everyone', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
  ],
);
