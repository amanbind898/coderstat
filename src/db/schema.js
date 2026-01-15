import { pgTable, serial, varchar, text, boolean, timestamp, integer, date, json, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ NextAuth Required Tables ============

// Users table - NextAuth core
export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  name: varchar('name'),
  email: varchar('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: varchar('image'),
  password: varchar('password'),
  role: varchar('role').default('user'),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Accounts table - OAuth providers
export const accounts = pgTable('accounts', {
  id: varchar('id').primaryKey(),
  userId: varchar('userId').notNull(),
  type: varchar('type').notNull(),
  provider: varchar('provider').notNull(),
  providerAccountId: varchar('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type'),
  scope: varchar('scope'),
  id_token: text('id_token'),
  session_state: varchar('session_state'),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: varchar('id').primaryKey(),
  sessionToken: varchar('sessionToken').unique().notNull(),
  userId: varchar('userId').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Verification tokens
export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier').notNull(),
  token: varchar('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// ============ App Tables (No FK constraints for clean migration) ============

// ProfileData table 
export const ProfileData = pgTable('ProfileData', {
  id: serial('id').primaryKey(),
  primaryEmail: varchar('primaryEmail').notNull(),
  name: varchar('name').notNull(),
  userId: varchar('userId'),
  dateOfBirth: date('dateOfBirth'),
  location: varchar('location'),
  bio: varchar('bio'),
  institute: varchar('institute'),
  profilePic: varchar('profilePic'),
  instagram: varchar('instagram'),
  linkedin: varchar('linkedin'),
  twitter: varchar('twitter'),
  github: varchar('github'),
  portfolio: varchar('portfolio'),
  geeksforgeeks: varchar('geeksforgeeks'),
  leetCode: varchar('leetCode'),
  codeforces: varchar('codeforces'),
  codechef: varchar('codechef'),
  createdAt: varchar('createdAt'),
  isPublic: boolean('isPublic').default(true),
});

// CodingPlatformStats table 
export const CodingPlatformStats = pgTable('CodingPlatformStats', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull(),
  platform: varchar('platform').notNull(),
  solvedCount: varchar('solvedCount').default('0'),
  rating: varchar('rating'),
  highestRating: varchar('highestRating'),
  globalRank: varchar('globalRank'),
  countryRank: varchar('countryRank'),
  lastUpdated: varchar('lastUpdated'),
  easyCount: varchar('easyCount').default('0'),
  mediumCount: varchar('mediumCount').default('0'),
  hardCount: varchar('hardCount').default('0'),
  fundamentalCount: varchar('fundamentalCount').default('0'),
  totalcontest: varchar('totalcontest').default('0'),
  languageStats: json('languageStats'),
});

// MasterQuestions table
export const MasterQuestions = pgTable('MasterQuestions', {
  id: serial('id').primaryKey(),
  topic: varchar('topic').notNull(),
  problem: varchar('problem').notNull(),
  url: varchar('url'),
  difficulty: varchar('difficulty'),
  source: varchar('source').notNull(),
  sourceId: varchar('sourceId'),
  tags: json('tags'),
  addedAt: timestamp('addedAt').defaultNow(),
});

// User's question progress table
export const UserQuestionProgress = pgTable('UserQuestionProgress', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull(),
  questionId: integer('questionId').notNull(),
  status: varchar('status').notNull().default('not_started'),
  timesAttempted: integer('timesAttempted').default(0),
  lastAttemptDate: timestamp('lastAttemptDate'),
  solvedDate: timestamp('solvedDate'),
  timeSpent: integer('timeSpent'),
  solution: text('solution'),
  language: varchar('language'),
  notes: text('notes'),
  confidence: integer('confidence').default(0),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============ Relations (for querying, not FK constraints) ============

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
