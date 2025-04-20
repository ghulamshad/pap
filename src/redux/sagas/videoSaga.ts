import { call, put, takeLatest, select } from 'redux-saga/effects';
import { fetchVideosStart, fetchVideosSuccess, fetchVideosFailure } from '../slices/videoSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { VideoItem } from '../slices/videoSlice';
import { RootState } from '../store';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

interface FetchVideosParams {
  pageToken?: string;
  year?: number;
  month?: number;
  search?: string;
}

// Interface for YouTube API response items
interface YouTubeApiVideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

async function fetchVideosFromAPI(params: FetchVideosParams) {
  const { pageToken, year, month, search } = params;
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`;
  
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  const data = await response.json();
  return data;
}

function* fetchVideosSaga(): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const { filters, pagination } = state.videos;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
    let allVideos: YouTubeApiVideoItem[] = [];
    let nextPageToken = null;

    // Fetch all videos
    do {
      const response: Response = yield call(fetch, 
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      );
      const data: any = yield response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      allVideos = [...allVideos, ...data.items];
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    // Apply filters
    let filteredVideos = allVideos;
    if (filters.year) {
      filteredVideos = filteredVideos.filter(video => 
        new Date(video.snippet.publishedAt).getFullYear() === filters.year
      );
    }
    if (filters.month) {
      filteredVideos = filteredVideos.filter(video => 
        new Date(video.snippet.publishedAt).getMonth() + 1 === filters.month
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredVideos = filteredVideos.filter(video =>
        video.snippet.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const paginatedVideos = filteredVideos.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );

    // Map YouTube API response to VideoItem format
    const mappedVideos: VideoItem[] = paginatedVideos.map(video => ({
      id: video.id.videoId,
      videoId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt
    }));

    const mappedAllVideos: VideoItem[] = allVideos.map(video => ({
      id: video.id.videoId,
      videoId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt
    }));

    yield put(fetchVideosSuccess({
      videos: mappedVideos,
      allVideos: mappedAllVideos
    }));
  } catch (error) {
    yield put(fetchVideosFailure(error instanceof Error ? error.message : 'Failed to fetch videos'));
  }
}

export function* videoSaga() {
  yield takeLatest(fetchVideosStart.type, fetchVideosSaga);
} 