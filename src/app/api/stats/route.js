import { db } from "../../../db/index";
import { CodingPlatformStats } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    // Fetch all platform stats for the user
    const userStats = await db
      .select()
      .from(CodingPlatformStats)
      .where(eq(CodingPlatformStats.userId, userId));

    if (userStats.length > 0) {
      return NextResponse.json({ userStats }, { status: 200 });
    } else {
      return NextResponse.json({ error: "No stats found for the user" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching userStats data:", error);
    return NextResponse.json({ error: "Failed to fetch userStats data" }, { status: 500 });
  }
}