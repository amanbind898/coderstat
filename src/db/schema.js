import { pgTable, serial, varchar, text, boolean, timestamp, integer, date, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ProfileData table - core user information as specified
export const ProfileData = pgTable('ProfileData', {
  id: serial('id').primaryKey(),
  primaryEmail: varchar('primaryEmail').notNull(),
  name: varchar('name').notNull(),
  clerkId: varchar('clerkId'),
  dateOfBirth: date('dateOfBirth'),
  location: varchar('location'),
  bio: varchar('bio'),
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
});

// CodingPlatformStats table - as specified
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

// Added relations for the existing tables
export const profileDataRelations = relations(ProfileData, ({ many }) => ({
  platformStats: many(CodingPlatformStats),
  questionTracker: many(QuestionTracker),
  platformVisibility: many(PlatformVisibility),
}));

export const codingPlatformStatsRelations = relations(CodingPlatformStats, ({ one, many }) => ({
  profile: one(ProfileData, {
    fields: [CodingPlatformStats.clerkId],
    references: [ProfileData.clerkId],
  }),
  questions: many(QuestionTracker),
}));

// QuestionTracker table - added for question tracking feature
export const QuestionTracker = pgTable('QuestionTracker', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  platform: varchar('platform').notNull(), // leetcode, codeforces, etc.
  questionId: varchar('questionId').notNull(), // Platform-specific question ID
  title: varchar('title').notNull(),
  url: varchar('url'),
  difficulty: varchar('difficulty'), // easy, medium, hard
  tags: json('tags'), // Store tags/topics as JSON array
  status: varchar('status').notNull().default('unsolved'), // unsolved, solved, attempted, bookmarked
  submissionCount: integer('submissionCount').default(0),
  lastAttemptDate: timestamp('lastAttemptDate'),
  solvedDate: timestamp('solvedDate'),
  timeSpent: integer('timeSpent'), // In minutes
  notes: text('notes'),
  code: text('code'), // Store the solution code
  language: varchar('language'), // Programming language used
  timeComplexity: varchar('timeComplexity'),
  spaceComplexity: varchar('spaceComplexity'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// PlatformVisibility table - for controlling what's shown on profile
export const PlatformVisibility = pgTable('PlatformVisibility', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  platformName: varchar('platformName').notNull(), // Can be a coding platform or social media
  isVisible: boolean('isVisible').default(true),
  showRating: boolean('showRating').default(true),
  showRank: boolean('showRank').default(true),
  showSolvedCount: boolean('showSolvedCount').default(true),
  showContestParticipation: boolean('showContestParticipation').default(true),
  showQuestions: boolean('showQuestions').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Question relations
export const questionTrackerRelations = relations(QuestionTracker, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [QuestionTracker.clerkId],
    references: [ProfileData.clerkId],
  }),
}));

// Platform visibility relations
export const platformVisibilityRelations = relations(PlatformVisibility, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [PlatformVisibility.clerkId],
    references: [ProfileData.clerkId],
  }),
}));

// Events table - for tracking important user activities
export const Events = pgTable('Events', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  eventType: varchar('eventType').notNull(), // problem_solved, contest_completed, rating_change, etc.
  platform: varchar('platform').notNull(),
  details: json('details'), // Store event-specific details
  timestamp: timestamp('timestamp').defaultNow(),
});

export const eventsRelations = relations(Events, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [Events.clerkId],
    references: [ProfileData.clerkId],
  }),
}));

// Progress table - for tracking progress over time
export const ProgressTracker = pgTable('ProgressTracker', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  platform: varchar('platform').notNull(),
  date: date('date').notNull(),
  solvedCount: integer('solvedCount').default(0),
  rating: integer('rating'),
  rank: integer('rank'),
  easyCount: integer('easyCount').default(0),
  mediumCount: integer('mediumCount').default(0),
  hardCount: integer('hardCount').default(0),
});

export const progressTrackerRelations = relations(ProgressTracker, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [ProgressTracker.clerkId],
    references: [ProfileData.clerkId],
  }),
}));

// Profile analytics tracking
export const ProfileAnalytics = pgTable('ProfileAnalytics', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerkId').notNull(),
  visitorId: varchar('visitorId'),
  visitorClerkId: varchar('visitorClerkId'), // If visitor is a logged-in user
  visitDate: timestamp('visitDate').defaultNow(),
  referrer: varchar('referrer'),
  userAgent: varchar('userAgent'),
  ipAddress: varchar('ipAddress'),
  countryCode: varchar('countryCode'),
  city: varchar('city'),
});

export const profileAnalyticsRelations = relations(ProfileAnalytics, ({ one }) => ({
  profile: one(ProfileData, {
    fields: [ProfileAnalytics.clerkId],
    references: [ProfileData.clerkId],
  }),
}));
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
  
  // Relations
  export const masterQuestionsRelations = relations(MasterQuestions, ({ many }) => ({
    userProgress: many(UserQuestionProgress),
  }));
  
  export const userQuestionProgressRelations = relations(UserQuestionProgress, ({ one }) => ({
    question: one(MasterQuestions, {
      fields: [UserQuestionProgress.questionId],
      references: [MasterQuestions.id],
    }),
  }));