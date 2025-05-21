import { pgTable, serial, varchar, text, boolean, timestamp, integer, date, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ProfileData table 
export const ProfileData = pgTable('ProfileData', {
  id: serial('id').primaryKey(),
  primaryEmail: varchar('primaryEmail').notNull(),
  name: varchar('name').notNull(),
  clerkId: varchar('clerkId'),
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
  clerkId: varchar('clerkId').notNull(),
  platform: varchar('platform').notNull(),
  solvedCount: varchar('solvedCount').default('0'),
  rating: varchar('rating'),           // Optional field, implicitly nullable
  highestRating: varchar('highestRating'), // Optional field, implicitly nullable
  globalRank: varchar('globalRank'),    // Optional field, implicitly nullable
  countryRank: varchar('countryRank'),  // Optional field, implicitly nullable
  lastUpdated: varchar('lastUpdated'),
  easyCount: varchar('easyCount').default('0'),
  mediumCount: varchar('mediumCount').default('0'),
  hardCount: varchar('hardCount').default('0'),
  fundamentalCount: varchar('fundamentalCount').default('0'),
  totalcontest: varchar('totalcontest').default('0'),
});

// MasterQuestions table - for storing questions
export const MasterQuestions = pgTable('MasterQuestions', {
  id: serial('id').primaryKey(),
  topic: varchar('topic').notNull(),
  problem: varchar('problem').notNull(),
  url: varchar('url'),
  difficulty: varchar('difficulty'), // easy, medium, hard
  source: varchar('source').notNull(), // e.g., "geeksforgeeks", "leetcode"
  sourceId: varchar('sourceId'), // Original ID from the source platform
  tags: json('tags'), // Additional tags/topics as JSON array
  addedAt: timestamp('addedAt').defaultNow(),
});

// User's question progress table - tracks individual progress
export const UserQuestionProgress = pgTable('UserQuestionProgress', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  questionId: integer('questionId').notNull().references(() => MasterQuestions.id),
  status: varchar('status').notNull().default('not_started'), // not_started, in_progress, solved, bookmarked
  timesAttempted: integer('timesAttempted').default(0),
  lastAttemptDate: timestamp('lastAttemptDate'),
  solvedDate: timestamp('solvedDate'),
  timeSpent: integer('timeSpent'), // In minutes
  solution: text('solution'), // User's solution code
  language: varchar('language'), // Programming language used
  notes: text('notes'), // User's notes about the question
  confidence: integer('confidence').default(0), // 0-5 rating of user's confidence
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// RELATIONS

export const codingPlatformStatsRelations = relations(CodingPlatformStats, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [CodingPlatformStats.clerkId],
    references: [ProfileData.clerkId],
  }),
 
}));

export const masterQuestionsRelations = relations(MasterQuestions, ({ many }) => ({
  userProgress: many(UserQuestionProgress),
}));

export const userQuestionProgressRelations = relations(UserQuestionProgress, ({ one }) => ({
  question: one(MasterQuestions, {
    fields: [UserQuestionProgress.questionId],
    references: [MasterQuestions.id],
  }),
}));

