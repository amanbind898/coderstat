import { db } from '../db';
import { MasterQuestions, UserQuestionProgress } from '../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export async function importQuestionsFromJson(questions) {
  const result = { added: 0, skipped: 0, errors: [] };

  try {
    for (const sheetName in questions) {
      const sheetQuestions = questions[sheetName];

      for (const q of sheetQuestions) {
        try {
          const problem = q["Problem: "] || q["Problem:"] || "";
          if (!problem) {
            result.errors.push(`Missing problem title in question: ${JSON.stringify(q)}`);
            continue;
          }

          let url = q.URL || "";
          let source = "";
          let sourceId = null;
          if (url) {
            try {
              const urlObj = new URL(url);
              source = urlObj.hostname.replace("www.", "").split(".")[0];
              // Extract sourceId (e.g., LeetCode problem number)
              const pathParts = urlObj.pathname.split("/").filter(Boolean);
              sourceId = pathParts[pathParts.length - 1] || null; 
            } catch (e) {
              result.errors.push(`Invalid URL in question: ${JSON.stringify(q)}, Error: ${e.message}`);
              url = null;
            }
          }

          const existingQuestion = await db
            .select()
            .from(MasterQuestions)
            .where(and(eq(MasterQuestions.problem, problem), eq(MasterQuestions.url, url)))
            .limit(1);

          if (existingQuestion.length > 0) {
            result.skipped++;
            continue;
          }

          await db.insert(MasterQuestions).values({
            topic: q["Topic:"] || "Uncategorized",
            problem,
            url,
            difficulty: q["Difficulty"] || null,
            source: source || "unknown",
            sourceId,
            tags: JSON.stringify([q["Topic:"]].filter(Boolean)), // Filter out null/undefined
          });

          result.added++;
        } catch (error) {
          result.errors.push(`Error processing question: ${JSON.stringify(q)}, Error: ${error.message}`);
        }
      }
    }

    return result;
  } catch (error) {
    result.errors.push(`General import error: ${error.message}`);
    return result;
  }
}

export async function getUserQuestions(clerkId) {
    try {
      const questions = await db
        .select({
          id: MasterQuestions.id,
          topic: MasterQuestions.topic,
          problem: MasterQuestions.problem,
          url: MasterQuestions.url,
          difficulty: MasterQuestions.difficulty,
          source: MasterQuestions.source,
          tags: MasterQuestions.tags,
          status: UserQuestionProgress.status,
          timesAttempted: UserQuestionProgress.timesAttempted,
          solvedDate: UserQuestionProgress.solvedDate,
          notes: UserQuestionProgress.notes,
        })
        .from(MasterQuestions)
        .leftJoin(
          UserQuestionProgress,
          and(
            eq(MasterQuestions.id, UserQuestionProgress.questionId),
            eq(UserQuestionProgress.clerkId, clerkId)
          )
        );

      return questions.map(q => ({
        ...q,
        tags: (() => {
          try {
            // Handle case where tags might be invalid JSON
            return q.tags ? JSON.parse(q.tags) : [];
          } catch (e) {
            // If parsing fails, return empty array or convert string to array if possible
            if (typeof q.tags === 'string') {
              return q.tags === 'Array' ? [] : [q.tags];
            }
            return [];
          }
        })()
      }));
    } catch (error) {
      console.error('Error in getUserQuestions:', error);
      throw error;
    }
}

export async function updateQuestionStatus(userId, questionId, status) {
  try {
    // Create a new Date object for timestamps
    const currentDate = new Date();
    
    // First check if the record exists
    const existingProgress = await db
      .select()
      .from(UserQuestionProgress)
      .where(and(
        eq(UserQuestionProgress.clerkId, userId),
        eq(UserQuestionProgress.questionId, questionId)
      ))
      .limit(1);

    if (existingProgress.length > 0) {
      // Update existing record
      const updateValues = {
        status,
        timesAttempted: status === 'in_progress' 
          ? sql`${UserQuestionProgress.timesAttempted} + 1` 
          : UserQuestionProgress.timesAttempted
      };
      
      // Only set these date fields conditionally
      if (status === 'solved') {
        updateValues.solvedDate = currentDate;
      }
      
      if (status === 'in_progress') {
        updateValues.lastAttemptDate = currentDate;
      }
      
      // Always update the updatedAt timestamp
      updateValues.updatedAt = currentDate;
      
      await db
        .update(UserQuestionProgress)
        .set(updateValues)
        .where(and(
          eq(UserQuestionProgress.clerkId, userId),
          eq(UserQuestionProgress.questionId, questionId)
        ));
    } else {
      // Insert new record
      const insertValues = {
        clerkId: userId,
        questionId,
        status,
        timesAttempted: status === 'in_progress' ? 1 : 0
      };
      
      // Only set these date fields conditionally
      if (status === 'solved') {
        insertValues.solvedDate = currentDate;
      }
      
      if (status === 'in_progress') {
        insertValues.lastAttemptDate = currentDate;
      }
      
      await db.insert(UserQuestionProgress).values(insertValues);
    }
    
    return { success: true, status };
  } catch (error) {
    console.error('Error in updateQuestionStatus:', error);
    throw error;
  }
}

export async function getUserProgressStats(userId) {
    try {
      // Get total number of questions
      const totalQuestionsResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(MasterQuestions);
      const totalQuestions = Number(totalQuestionsResult[0].count);
      
      // Build the progress query
      const progressQuery = db
        .select({
          status: UserQuestionProgress.status,
          count: sql`COUNT(*)`.as('count'),
        })
        .from(UserQuestionProgress)
        .where(eq(UserQuestionProgress.clerkId, userId))
        .groupBy(UserQuestionProgress.status);
      
      // Execute the query
      let progressCounts;
      try {
        progressCounts = await progressQuery;
      } catch (execError) {
        console.error('Execution error:', execError);
        progressCounts = [];
      }
      
      // Process results
      const userProgress = progressCounts.map(p => ({
        status: p.status,
        count: Number(p.count),
      }));
      
      return calculateStats(totalQuestions, userProgress);
    } catch (error) {
      console.error('Error in getUserProgressStats:', error);
      throw error;
    }
}

export function calculateStats(allQuestionCount, userProgress) {
  const stats = {
    totalQuestions: allQuestionCount,
    solved: 0,
    inProgress: 0,
    bookmarked: 0,
    notStarted: allQuestionCount,
    progressPercentage: 0,
  };

  userProgress.forEach(item => {
    if (item.status === 'solved') stats.solved = item.count;
    if (item.status === 'in_progress') stats.inProgress = item.count;
    if (item.status === 'bookmarked') stats.bookmarked = item.count;
  });

  stats.notStarted = allQuestionCount - stats.solved - stats.inProgress - stats.bookmarked;
  stats.progressPercentage = allQuestionCount > 0 ? (stats.solved / allQuestionCount) * 100 : 0;

  return stats;
}

// Helper function for debugging table schema
export async function debugTableSchema() {
  try {
    // Get schema information for UserQuestionProgress table
    const schemaInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'UserQuestionProgress'
    `);
    
    // Get table names
    const tableNames = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    
    return {
      tables: tableNames,
      schemaInfo: schemaInfo
    };
  } catch (error) {
    console.error('Error in debugTableSchema:', error);
    return { error: error.message };
  }
}