import { db } from '@/lib/db';
import { VideoItem } from '@/redux/slices/videoSlice';
import type { Video } from '@/generated/prisma';
import axios from 'axios';

// Validate environment variables
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

if (!API_KEY || !CHANNEL_ID) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_YOUTUBE_API_KEY or NEXT_PUBLIC_YOUTUBE_CHANNEL_ID');
}

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Custom error types
class VideoFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'VideoFetchError';
  }
}

interface YouTubeResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<{
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  }>;
}

export const youtubeService = {
  async fetchVideos(pageToken?: string, maxResults: number = 6): Promise<{ items: VideoItem[]; nextPageToken?: string }> {
    try {
      // Fetch videos from database with proper typing
      const videos = await db.video.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: maxResults,
        skip: pageToken ? parseInt(pageToken) : 0
      });

      // Map database records to VideoItem format with proper typing
      const mappedVideos = videos.map(video => ({
        id: video.id,
        videoId: video.videoId,
        title: video.title,
        description: video.description,
        publishedAt: video.publishedAt.toISOString(),
        thumbnailUrl: video.thumbnailUrl,
        channelTitle: video.channelTitle
      }));

      const nextPageToken = videos.length === maxResults ? 
        ((pageToken ? parseInt(pageToken) : 0) + maxResults).toString() : 
        undefined;

      return {
        items: mappedVideos,
        nextPageToken
      };
    } catch (error) {
      console.error('Error fetching videos from database:', error);
      
      // Try to fetch fallback data from the API route
      try {
        const response = await axios.get('/api/fallback-videos');
        const fallbackData = response.data as YouTubeResponse;
        
        // Map the fallback data to VideoItem format with proper typing
        const fallbackItems: VideoItem[] = fallbackData.items.map(item => ({
          id: item.id.videoId,
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle
        }));
        
        const skip = pageToken ? parseInt(pageToken) : 0;
        const paginatedItems = fallbackItems.slice(skip, skip + maxResults);
        const hasMore = fallbackItems.length > skip + maxResults;
        
        return {
          items: paginatedItems,
          nextPageToken: hasMore ? (skip + maxResults).toString() : undefined
        };
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
        throw new VideoFetchError('Failed to fetch videos and load fallback data', fallbackError);
      }
    }
  }
}; 