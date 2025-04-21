import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const FALLBACK_DATA_PATH = path.join(process.cwd(), 'public', 'data', 'page-0.json');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get('pageToken');
  const skip = pageToken ? parseInt(pageToken, 10) : 0;
  const maxResults = 6;

  try {
    const videos = await db.video.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      take: maxResults,
      skip
    });

    const items = videos.map(video => ({
      id: video.id,
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      publishedAt: video.publishedAt.toISOString(),
      thumbnailUrl: video.thumbnailUrl,
      channelTitle: video.channelTitle
    }));

    const nextPageToken = videos.length === maxResults ? (skip + maxResults).toString() : undefined;

    return NextResponse.json({ items, nextPageToken });
  } catch (err) {
    console.error('DB fetch failed, trying fallback JSON:', err);

    try {
      if (fs.existsSync(FALLBACK_DATA_PATH)) {
        const rawData = fs.readFileSync(FALLBACK_DATA_PATH, 'utf-8');
        const fallback = JSON.parse(rawData);

        const items = fallback.items.map((item: any) => ({
          id: item.id.videoId,
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle
        }));

        const paginated = items.slice(skip, skip + maxResults);
        const hasMore = items.length > skip + maxResults;

        return NextResponse.json({
          items: paginated,
          nextPageToken: hasMore ? (skip + maxResults).toString() : undefined
        });
      } else {
        return NextResponse.json({ error: 'Fallback JSON not found' }, { status: 500 });
      }
    } catch (fallbackErr) {
      console.error('Failed loading fallback JSON:', fallbackErr);
      return NextResponse.json({ error: 'All sources failed' }, { status: 500 });
    }
  }
}
