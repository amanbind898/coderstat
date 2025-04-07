// app/api/updatePlatformStats/route.js
import { NextResponse } from "next/server";
import { db } from "@/db";
import { CodingPlatformStats } from "@/db/schema";
import { 
  fetchLeetCodeStats, 
  fetchGeeksForGeeksStats, 
  fetchCodeforcesStats, 
  fetchCodeChefStats 
} from "@/lib/platformAPI";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  try {
    const { clerkId, leetCode, geeksforgeeks, codeforces, codechef } = await req.json();

    const platforms = [
      leetCode && { name: 'LeetCode', username: leetCode, fetchFn: fetchLeetCodeStats },
      geeksforgeeks && { name: 'GeeksforGeeks', username: geeksforgeeks, fetchFn: fetchGeeksForGeeksStats },
      codeforces && { name: 'Codeforces', username: codeforces, fetchFn: fetchCodeforcesStats },
      codechef && { name: 'CodeChef', username: codechef, fetchFn: fetchCodeChefStats },
    ].filter(Boolean);

    for (const platform of platforms) {
      const stats = await platform.fetchFn(platform.username);

      if (!stats) {
        return NextResponse.json({ error: `Failed to fetch ${platform.name} stats` }, { status: 500 });
      }

      const dataToInsertOrUpdate = {
        solvedCount: stats.solvedCount || "0",
        rating: stats.rating || null,
        highestRating: stats.highestRating || null,
        globalRank: stats.globalRank || null,
        countryRank: stats.countryRank || null,
        lastUpdated: stats.lastUpdated,
        easyCount: stats.easyCount || "0",
        mediumCount: stats.mediumCount || "0",
        hardCount: stats.hardCount || "0",
        fundamentalCount: stats.fundamentalCount || "0",
        totalcontest: stats.totalcontest || "0"
      };

      const existingRecord = await db
        .select()
        .from(CodingPlatformStats)
        .where(
          and(
            eq(CodingPlatformStats.clerkId, clerkId),
            eq(CodingPlatformStats.platform, platform.name)
          )
        )
        .limit(1);

      if (existingRecord.length > 0) {
        await db
          .update(CodingPlatformStats)
          .set(dataToInsertOrUpdate)
          .where(
            and(
              eq(CodingPlatformStats.clerkId, clerkId),
              eq(CodingPlatformStats.platform, platform.name)
            )
          );
      } else {
        await db
          .insert(CodingPlatformStats)
          .values({
            clerkId,
            platform: platform.name,
            ...dataToInsertOrUpdate
          });
      }
    }

    return NextResponse.json({ message: "Platform stats updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
