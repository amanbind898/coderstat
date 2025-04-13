import { NextResponse } from 'next/server';
import { db } from '../../../db/index'; // Adjust based on your actual db client location
import { ProfileData } from '../../../db/schema'; // Adjust if schema is in a different path
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { clerkId, isPublic } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }


    const result = await db
      .update(ProfileData)
      .set({ isPublic })
      .where(eq(ProfileData.clerkId, clerkId))
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