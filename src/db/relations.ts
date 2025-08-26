import { relations } from 'drizzle-orm/relations';
import { users, profile, userRole, roles } from './schema';

// Users table relations (auth schema)
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profile, {
    fields: [users.id],
    references: [profile.userId],
  }),
}));

// Profile table relations
export const profileRelations = relations(profile, ({ one }) => ({
  user: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
  // userRole: one(userRole, {
  //   fields: [profile.userId],
  //   references: [userRole.userId],
  // }),
  userRole: one(userRole),
}));

// Roles table relations
export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRole),
}));

// UserRole table relations
export const userRoleRelations = relations(userRole, ({ one }) => ({
  role: one(roles, {
    fields: [userRole.roleId],
    references: [roles.roleId],
  }),
  profile: one(profile, {
    fields: [userRole.userId],
    references: [profile.userId],
  }),
}));
