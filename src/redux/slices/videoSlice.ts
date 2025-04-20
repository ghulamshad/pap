import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  videoId: string;
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
  videos: VideoItem[];
  allVideos: VideoItem[];
  filters: VideoFilters;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  allVideos: [],
  filters: {},
  pagination: {
    currentPage: 1,
    itemsPerPage: 12
  },
  loading: false,
  error: null
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    fetchVideosStart: (state, action: PayloadAction<{ pageToken?: string }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchVideosSuccess: (state, action: PayloadAction<{ videos: VideoItem[]; allVideos: VideoItem[] }>) => {
      state.loading = false;
      state.videos = action.payload.videos;
      state.allVideos = action.payload.allVideos;
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
    }
  }
});

export const {
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  setFilters,
  setPage,
  clearFilters
} = videoSlice.actions;

export default videoSlice.reducer; 