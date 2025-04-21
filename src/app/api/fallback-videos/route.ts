import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const fallbackDataPath = path.join(process.cwd(), 'public', 'data', 'fallback-videos.json');
    
    if (!fs.existsSync(fallbackDataPath)) {
      return NextResponse.json(
        { error: 'Fallback data not found' },
        { status: 404 }
      );
    }

    const fallbackData = JSON.parse(fs.readFileSync(fallbackDataPath, 'utf8'));
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Error serving fallback data:', error);
    return NextResponse.json(
      { error: 'Failed to serve fallback data' },
      { status: 500 }
    );
  }
} 