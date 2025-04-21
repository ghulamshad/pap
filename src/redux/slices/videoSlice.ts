import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
}

export interface VideoFilters {
  year?: number;
  month?: number;
  search?: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface VideoState {
  items: VideoItem[];
  allVideos: VideoItem[];
  filters: VideoFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  nextPageToken: string | null;
}

const initialState: VideoState = {
  items: [],
  allVideos: [],
  filters: {},
  pagination: {
    currentPage: 1,
    itemsPerPage: 12
  },
  loading: false,
  error: null,
  nextPageToken: null
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    fetchVideosStart: (state, action: PayloadAction<{ pageToken?: string; maxResults?: number }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchVideosSuccess: (state, action: PayloadAction<{ items: VideoItem[]; nextPageToken: string | null }>) => {
      state.loading = false;
      state.items = [...state.items, ...action.payload.items];
      state.nextPageToken = action.payload.nextPageToken;
    },
    fetchVideosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<VideoFilters>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    clearVideos: (state) => {
      state.items = [];
      state.nextPageToken = null;
      state.error = null;
    }
  }
});

export const {
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  setFilters,
  setPage,
  clearFilters,
  clearVideos
} = videoSlice.actions;

export default videoSlice.reducer; 