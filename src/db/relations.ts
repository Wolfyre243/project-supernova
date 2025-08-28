import { relations } from 'drizzle-orm/relations';
import {
  users,
  profile,
  userRole,
  roles,
  status,
  account,
  category,
  income,
  expense,
  savingsGoal,
  budget,
} from './schema';

// Users table relations (auth schema)
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profile, {
    fields: [users.id],
    references: [profile.userId],
  }),
}));

// Status table relations
export const statusRelations = relations(status, ({ many }) => ({
  profiles: many(profile),
  accounts: many(account),
  categories: many(category),
  income: many(income),
  expenses: many(expense),
  savingsGoals: many(savingsGoal),
  budgets: many(budget),
}));

// Profile table relations
export const profileRelations = relations(profile, ({ one, many }) => ({
  user: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
  userRole: one(userRole),
  status: one(status, {
    fields: [profile.statusId],
    references: [status.statusId],
  }),
  accounts: many(account),
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

// Account table relations
export const accountRelations = relations(account, ({ one }) => ({
  user: one(profile, {
    fields: [account.userId],
    references: [profile.userId],
  }),
  status: one(status, {
    fields: [account.statusId],
    references: [status.statusId],
  }),
}));

// Category table relations
export const categoryRelations = relations(category, ({ one, many }) => ({
  user: one(profile, {
    fields: [category.userId],
    references: [profile.userId],
  }),
  status: one(status, {
    fields: [category.statusId],
    references: [status.statusId],
  }),
  income: many(income),
  expenses: many(expense),
}));

// Income table relations
export const incomeRelations = relations(income, ({ one }) => ({
  account: one(account, {
    fields: [income.accountId],
    references: [account.accountId],
  }),
  category: one(category, {
    fields: [income.categoryId],
    references: [category.categoryId],
  }),
}));

// Expense table relations
export const expenseRelations = relations(expense, ({ one }) => ({
  account: one(account, {
    fields: [expense.accountId],
    references: [account.accountId],
  }),
  category: one(category, {
    fields: [expense.categoryId],
    references: [category.categoryId],
  }),
}));

export const savingsGoalRelations = relations(savingsGoal, ({ one }) => ({
  account: one(account, {
    fields: [savingsGoal.accountId],
    references: [account.accountId],
  }),
  status: one(status, {
    fields: [savingsGoal.statusId],
    references: [status.statusId],
  }),
}));

export const budgetRelations = relations(budget, ({ one }) => ({
  category: one(category, {
    fields: [budget.categoryId],
    references: [category.categoryId],
  }),
  status: one(status, {
    fields: [budget.statusId],
    references: [status.statusId],
  }),
}));
