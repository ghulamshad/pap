'use client'

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  TextField, 
  MenuItem, 
  Button, 
  Typography, 
  CircularProgress, 
  useTheme, 
  useMediaQuery,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Alert,
  AlertTitle,
  InputAdornment
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchVideosStart, fetchVideosSuccess, fetchVideosFailure, setFilters, setPage, clearFilters } from '@/redux/slices/videoSlice';
import { VideoItem } from '@/redux/slices/videoSlice';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import { AppDispatch } from '@/redux/store';
import { youtubeService } from '@/services/youtubeService';
import VideoCard from './VideoCard';
import axios from 'axios';

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

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const VIDEOS_PER_PAGE = 6;

const AllVideos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, allVideos, filters, pagination, loading, error } = useSelector((state: RootState) => state.videos);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [youtubeData, setYoutubeData] = useState<YouTubeResponse | null>(null);
  const [allVideosData, setAllVideosData] = useState<any[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Extract years from all fetched videos
  useEffect(() => {
    if (allVideosData.length > 0) {
      const years = new Set<number>();
      allVideosData.forEach(video => {
        const year = new Date(video.snippet.publishedAt).getFullYear();
        years.add(year);
      });
      setAvailableYears(Array.from(years).sort((a, b) => b - a));
    }
  }, [allVideosData]);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        dispatch(fetchVideosStart({ pageToken }));
        let allVideos: any[] = [];
        let nextPageToken: string | undefined = undefined;
        let hasMorePages = true;
        
        // Fetch all videos from the channel
        while (hasMorePages) {
          const result = await youtubeService.fetchVideos(nextPageToken);
          allVideos = [...allVideos, ...result.items];
          nextPageToken = result.nextPageToken;
          
          // Check if we have more pages
          hasMorePages = !!nextPageToken;
          
          // If we've fetched enough videos, we can stop
          if (allVideos.length >= 50) {
            hasMorePages = false;
          }
        }
        
        setAllVideosData(allVideos);
        setHasMore(allVideos.length > VIDEOS_PER_PAGE);
        
        // Set initial displayed videos
        setDisplayedVideos(allVideos.slice(0, VIDEOS_PER_PAGE));
        
        // Update Redux state with all videos
        dispatch(fetchVideosSuccess({ 
          items: allVideos.slice(0, VIDEOS_PER_PAGE), 
          nextPageToken: null 
        }));
      } catch (error) {
        console.error('Error fetching videos:', error);
        
        // Check if it's a quota exceeded error
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          setIsQuotaExceeded(true);
          dispatch(fetchVideosFailure('YouTube API quota exceeded. Using fallback data.'));
        } else {
          dispatch(fetchVideosFailure(error instanceof Error ? error.message : 'Failed to fetch videos'));
        }
      }
    };

    fetchAllVideos();
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    dispatch(setFilters({ ...filters, search: event.target.value }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = event.target.value ? parseInt(event.target.value) : undefined;
    dispatch(setFilters({ ...filters, year }));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const month = event.target.value ? parseInt(event.target.value) : undefined;
    dispatch(setFilters({ ...filters, month }));
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * VIDEOS_PER_PAGE;
    
    const newDisplayedVideos = allVideosData.slice(startIndex, endIndex);
    setDisplayedVideos(newDisplayedVideos);
    setCurrentPage(nextPage);
    setHasMore(newDisplayedVideos.length < allVideosData.length);
    
    // Update Redux state with new displayed videos
    dispatch(fetchVideosSuccess({ 
      items: newDisplayedVideos, 
      nextPageToken: undefined 
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSortBy('newest');
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.year !== undefined || filters.month !== undefined || searchInput !== '';

  const filteredVideos = displayedVideos.filter(video => {
    // Add null checks to prevent errors
    if (!video || !video.snippet) return false;
    
    const matchesSearch = video.snippet.title.toLowerCase().includes(searchInput.toLowerCase());
    const videoDate = new Date(video.snippet.publishedAt);
    const videoYear = videoDate.getFullYear();
    const videoMonth = videoDate.getMonth();
    
    const matchesYear = !filters.year || videoYear === filters.year;
    const matchesMonth = filters.month === undefined || videoMonth === filters.month;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime();
    }
    return new Date(a.snippet.publishedAt).getTime() - new Date(b.snippet.publishedAt).getTime();
  });

  if (loading && !displayedVideos.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Videos
        </Typography>
        
        {/* Quota exceeded message */}
        {isQuotaExceeded && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>YouTube API Quota Exceeded</AlertTitle>
            The YouTube API quota has been exceeded. We are showing fallback data. 
            This will be resolved when the quota resets.
          </Alert>
        )}
        
        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search videos"
                value={searchInput}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Year"
                value={filters.year || ''}
                onChange={handleYearChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">All Years</MenuItem>
                {availableYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Month"
                value={filters.month || ''}
                onChange={handleMonthChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">All Months</MenuItem>
                {MONTHS.map(month => (
                  <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ height: '40px' }}
                startIcon={<ClearIcon />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Active filters */}
        {hasActiveFilters && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.year && (
              <Chip 
                label={`Year: ${filters.year}`} 
                onDelete={() => dispatch(setFilters({ ...filters, year: undefined }))}
                size="small"
              />
            )}
            {filters.month !== undefined && (
              <Chip 
                label={`Month: ${MONTHS.find(m => m.value === filters.month)?.label}`} 
                onDelete={() => dispatch(setFilters({ ...filters, month: undefined }))}
                size="small"
              />
            )}
            {searchInput && (
              <Chip 
                label={`Search: ${searchInput}`} 
                onDelete={() => {
                  setSearchInput('');
                  dispatch(setFilters({ ...filters, search: '' }));
                }}
                size="small"
              />
            )}
          </Box>
        )}

        {/* Videos grid */}
        <Grid container spacing={2}>
          {sortedVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id.videoId}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>

        {/* Load more button */}
        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleLoadMore}
              sx={{ 
                borderRadius: 20,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AllVideos;
  
