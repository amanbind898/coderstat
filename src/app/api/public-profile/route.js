import { db } from '../../../db/index';
import { eq } from 'drizzle-orm';
import { ProfileData, CodingPlatformStats } from "../../../db/schema";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profile
    const profile = await db
      .select()
      .from(ProfileData)
      .where(eq(ProfileData.userId, userId));

    if (!profile || profile.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userProfile = profile[0];

    // Check visibility
    if (!userProfile.isPublic) {
      return new Response(
        JSON.stringify({ error: "This profile is private" }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch coding stats
    const stats = await db
      .select()
      .from(CodingPlatformStats)
      .where(eq(CodingPlatformStats.userId, userId));

    return new Response(
      JSON.stringify({
        profile: {
          name: userProfile.name,
          bio: userProfile.bio,
          location: userProfile.location,
          dateOfBirth: userProfile.dateOfBirth,
          institute: userProfile.institute,
          profilePic: userProfile.profilePic,
          instagram: userProfile.instagram,
          linkedin: userProfile.linkedin,
          twitter: userProfile.twitter,
          github: userProfile.github,
          portfolio: userProfile.portfolio,
          geeksforgeeks: userProfile.geeksforgeeks,
          leetCode: userProfile.leetCode,
          codeforces: userProfile.codeforces,
          codechef: userProfile.codechef,
          createdAt: userProfile.createdAt,
        },
        stats: stats || []
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch public profile" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
