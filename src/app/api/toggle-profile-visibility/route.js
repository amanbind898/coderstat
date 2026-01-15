import { NextResponse } from 'next/server';
import { db } from '../../../db/index';
import { ProfileData } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { userId, isPublic } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .update(ProfileData)
      .set({ isPublic })
      .where(eq(ProfileData.userId, userId))
      .returning();

    return NextResponse.json(
      { success: true, profile: result[0] },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile visibility' },
      { status: 500 }
    );
  }
}