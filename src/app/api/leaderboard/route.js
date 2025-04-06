// src/app/api/leaderboard/route.js
import { db } from '../../../db/index';
import { UserQuestionProgress, ProfileData } from '../../../db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  
  try {
    // Query to get the solved counts for each user
    const leaderboardData = await db
      .select({
        clerkId: UserQuestionProgress.clerkId,
        name: ProfileData.name,
        solvedCount: sql`COUNT(${UserQuestionProgress.id})`.as('solvedCount'),
        lastSolvedDate: sql`MAX(${UserQuestionProgress.solvedDate})`.as('lastSolvedDate')
      })
      .from(UserQuestionProgress)
      .leftJoin(ProfileData, eq(UserQuestionProgress.clerkId, ProfileData.clerkId))
      .where(eq(UserQuestionProgress.status, 'solved'))
      .groupBy(
        UserQuestionProgress.clerkId,
        ProfileData.name
      )
      .orderBy(
        desc(sql`COUNT(${UserQuestionProgress.id})`),
        desc(sql`MAX(${UserQuestionProgress.solvedDate})`)
      )
      .limit(limit);

    const rankedLeaderboard = leaderboardData.map((entry, index) => ({
      rank: index + 1,
      clerkId: entry.clerkId,
      name: entry.name || `User ${entry.clerkId.substring(0, 6)}...`,
      solvedCount: Number(entry.solvedCount),
      lastSolvedDate: entry.lastSolvedDate
    }));

    return NextResponse.json({
      success: true,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}