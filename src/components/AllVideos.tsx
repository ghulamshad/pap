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
  Card, 
  CardContent, 
  CardMedia, 
  useTheme, 
  useMediaQuery,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchVideosStart, fetchVideosSuccess, fetchVideosFailure, setFilters, setPage, clearFilters } from '@/redux/slices/videoSlice';
import { VideoItem } from '@/redux/slices/videoSlice';
import type { GridProps } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import { AppDispatch } from '@/redux/store';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

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

const AllVideos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, allVideos, filters, pagination, loading, error } = useSelector((state: RootState) => state.videos);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const years = React.useMemo(() => {
    const uniqueYears = new Set(allVideos.map((video: VideoItem) => new Date(video.publishedAt).getFullYear()));
    return Array.from(uniqueYears).sort((a, b) => (b as number) - (a as number)) as number[];
  }, [allVideos]);

  const fetchVideos = async (pageToken?: string) => {
    try {
      dispatch(fetchVideosStart({ pageToken }));
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12${pageToken ? `&pageToken=${pageToken}` : ''}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const videoDetails = await Promise.all(
        data.items.map(async (item: any) => {
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${item.id.videoId}&part=snippet`
          );
          const videoData = await videoResponse.json();
          return {
            id: item.id.videoId,
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnailUrl: item.snippet.thumbnails.high.url,
          };
        })
      );

      dispatch(fetchVideosSuccess({ videos: videoDetails, allVideos: videoDetails }));
    } catch (error) {
      dispatch(fetchVideosFailure(error instanceof Error ? error.message : 'Failed to fetch videos'));
    }
  };

  useEffect(() => {
    dispatch(fetchVideosStart({}));
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSortBy('newest');
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.year !== undefined || filters.month !== undefined || searchInput !== '';

  const filteredVideos = allVideos.filter((video: VideoItem) => {
    const matchesSearch = video.title.toLowerCase().includes(searchInput.toLowerCase());
    const videoDate = new Date(video.publishedAt);
    const videoYear = videoDate.getFullYear();
    const videoMonth = videoDate.getMonth();
    
    const matchesYear = !filters.year || videoYear === filters.year;
    const matchesMonth = filters.month === undefined || videoMonth === filters.month;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading videos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Videos
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid sx={{ display: 'flex', xs:12, sm:6, md:3}}>
            <TextField
              fullWidth
              label="Search"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid sx={{ display: 'flex', xs:12, sm:6, md:3}}>
            <TextField
              fullWidth
              select
              label="Year"
              value={filters.year || ''}
              onChange={handleYearChange}
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid sx={{ display: 'flex', xs:12, sm:6, md:3}}>
            <TextField
              fullWidth
              select
              label="Month"
              value={filters.month || ''}
              onChange={handleMonthChange}
            >
              <MenuItem value="">All Months</MenuItem>
              {MONTHS.map(month => (
                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid sx={{ display: 'flex', xs:12, sm:6, md:3}}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {sortedVideos.map((video: VideoItem) => (
            <Grid sx={{ display: 'flex', xs:12, sm:6, md:4}} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnailUrl}
                  alt={video.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {videos.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(allVideos.length / pagination.itemsPerPage)}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AllVideos;
  
