import { db } from "@/db/index";
import { ProfileData } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const profileData = await db
      .select()
      .from(ProfileData)
      .where(eq(ProfileData.clerkId, clerkId))
      .limit(1);

    if (profileData.length > 0) {
      return NextResponse.json({ profile: profileData[0] }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}