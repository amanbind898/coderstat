import { NextRequest, NextResponse } from 'next/server';
import { importQuestionsFromJson } from '../../../../lib/questionTrackerApi';

export async function POST(req) {
try {
    const json = await req.json();
    
    // Validate input
    if (!json || typeof json !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }
    
    // Import questions
    const result = await importQuestionsFromJson(json);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Question import error:', error);
    return NextResponse.json(
      { error: 'Failed to import questions', details: error.message },
      { status: 500 }
    );
  }
}