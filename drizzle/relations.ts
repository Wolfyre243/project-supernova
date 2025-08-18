import { relations } from 'drizzle-orm/relations';
import { users, profile } from './schema';

export const profileRelations = relations(profile, ({ one }) => ({
  usersInAuth: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profile),
}));
