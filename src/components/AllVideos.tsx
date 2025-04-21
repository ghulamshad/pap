import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fade,
  Zoom,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  PlayCircle as PlayIcon,
  LiveTv as LiveIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
    description?: string;
    tags?: string[];
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

const API_KEY = "AIzaSyB016n4M9H5PEVO74rTfbMQvxdViVocpRg";
const CHANNEL_ID = "UCUfE_2MHtAl1VIvpxoYBROA";

// Filter options
const yearOptions = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const durationOptions = ["All", "Short (< 4 min)", "Medium (4-20 min)", "Long (> 20 min)"];
const sortOptions = ["Newest First", "Oldest First", "Most Viewed", "Most Liked"];
const categoryOptions = ["All", "Assembly Sessions", "Committee Meetings", "Press Conferences", "Interviews", "Events", "Announcements"];

const AllVideos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [liveStream, setLiveStream] = useState<VideoItem | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("Newest First");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const router = useRouter();

  const fetchVideos = useCallback(async (token: string | null = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50${token ? `&pageToken=${token}` : ""}`
      );
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      const newItems: VideoItem[] = data.items || [];

      // Apply filters
      let filtered = newItems;
      
      // Year filter
      if (selectedYear !== "All") {
        filtered = filtered.filter((item) => 
          item.snippet.publishedAt.startsWith(selectedYear)
        );
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => 
          item.snippet.title.toLowerCase().includes(query) || 
          (item.snippet.description && item.snippet.description.toLowerCase().includes(query))
        );
      }
      
      // Category filter
      if (selectedCategory !== "All") {
        filtered = filtered.filter((item) => 
          item.snippet.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      
      // Sort
      if (selectedSort === "Oldest First") {
        filtered.sort((a, b) => 
          new Date(a.snippet.publishedAt).getTime() - new Date(b.snippet.publishedAt).getTime()
        );
      } else if (selectedSort === "Most Viewed") {
        filtered.sort(() => Math.random() - 0.5); // Placeholder for view count sort
      } else if (selectedSort === "Most Liked") {
        filtered.sort(() => Math.random() - 0.5); // Placeholder for like count sort
      }
      
      setVideos((prev) => (token ? [...prev, ...filtered] : filtered));
      setPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedSort, selectedCategory, searchQuery]);

  const fetchLiveStream = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&eventType=live&type=video`
      );
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setLiveStream(data.items[0]);
      }
    } catch (err) {
      console.error("Error fetching live stream:", err);
    }
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value);
    setVideos([]);
    setPageToken(null);
  };
  
  const handleDurationChange = (event: SelectChangeEvent) => {
    setSelectedDuration(event.target.value);
    setVideos([]);
    setPageToken(null);
  };
  
  const handleSortChange = (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value);
    setVideos([]);
    setPageToken(null);
  };
  
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
    setVideos([]);
    setPageToken(null);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setVideos([]);
    setPageToken(null);
    fetchVideos();
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const clearFilters = () => {
    setSelectedYear("All");
    setSelectedDuration("All");
    setSelectedSort("Newest First");
    setSelectedCategory("All");
    setSearchQuery("");
    setVideos([]);
    setPageToken(null);
    fetchVideos();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatDuration = (duration: string) => {
    // Placeholder for duration formatting
    return "10:30";
  };
  
  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  useEffect(() => {
    fetchVideos();
    fetchLiveStream();
  }, [fetchVideos]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Tabs */}
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { 
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 64,
            }
          }}
        >
          <Tab 
            icon={<PlayIcon />} 
            label="All Videos" 
            iconPosition="start"
          />
          <Tab 
            icon={<LiveIcon />} 
            label="Live Streams" 
            iconPosition="start"
          />
          <Tab 
            icon={<CategoryIcon />} 
            label="Categories" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Live Stream Section */}
      {activeTab === 1 && (
        <Fade in timeout={500}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LiveIcon color="error" /> Live Streams
            </Typography>

            {liveStream ? (
              <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${liveStream.id.videoId}`}
                    title="Live Stream"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {liveStream.snippet.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {liveStream.snippet.description || "No description available"}
                  </Typography>
                </CardContent>
              </Paper>
            ) : (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">
                  No live stream is currently active.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />} 
                  onClick={fetchLiveStream}
                  sx={{ mt: 2 }}
                >
                  Check Again
                </Button>
              </Paper>
            )}
          </Box>
        </Fade>
      )}

      {/* Categories Section */}
      {activeTab === 2 && (
        <Fade in timeout={500}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="primary" /> Video Categories
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {categoryOptions.filter(cat => cat !== "All").map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveTab(0);
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Browse videos in this category
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}

      {/* All Videos Section */}
      {activeTab === 0 && (
        <Fade in timeout={500}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayIcon color="primary" /> All Videos
            </Typography>
            
            {/* Search and Filters */}
            <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery("")}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ mr: 1 }}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
                
                {(selectedYear !== "All" || selectedDuration !== "All" || 
                  selectedSort !== "Newest First" || selectedCategory !== "All" || 
                  searchQuery) && (
                  <Button 
                    variant="text" 
                    size="small" 
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    color="error"
                  >
                    Clear Filters
                  </Button>
                )}
                
                {(selectedYear !== "All" || selectedCategory !== "All") && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 'auto' }}>
                    {selectedYear !== "All" && (
                      <Chip 
                        label={`Year: ${selectedYear}`} 
                        size="small" 
                        onDelete={() => setSelectedYear("All")}
                      />
                    )}
                    {selectedCategory !== "All" && (
                      <Chip 
                        label={`Category: ${selectedCategory}`} 
                        size="small" 
                        onDelete={() => setSelectedCategory("All")}
                      />
                    )}
                  </Box>
                )}
              </Box>
              
              {/* Expanded Filters */}
              {showFilters && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={selectedYear}
                      label="Year"
                      onChange={handleYearChange}
                    >
                      {yearOptions.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={selectedDuration}
                      label="Duration"
                      onChange={handleDurationChange}
                    >
                      {durationOptions.map((duration) => (
                        <MenuItem key={duration} value={duration}>
                          {duration}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={selectedSort}
                      label="Sort By"
                      onChange={handleSortChange}
                    >
                      {sortOptions.map((sort) => (
                        <MenuItem key={sort} value={sort}>
                          {sort}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      {categoryOptions.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Paper>
            
            {/* Error Message */}
            {error && (
              <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
                <Typography>{error}</Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small" 
                  onClick={() => fetchVideos()}
                  sx={{ mt: 1 }}
                >
                  Try Again
                </Button>
              </Paper>
            )}
            
            {/* Videos Grid */}
            {loading && videos.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : videos.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography color="text.secondary">
                  No videos found. Try adjusting your filters.
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={clearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {videos.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
                    <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Card 
                        elevation={2} 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          }
                        }}
                      >
                        <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${video.id.videoId}`}
                            title={video.snippet.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              border: 0,
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {video.snippet.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {formatDuration(video.contentDetails?.duration || "PT10M30S")}
                            </Typography>
                            
                            {video.statistics && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ViewIcon fontSize="small" sx={{ mr: 0.5 }} />
                                {formatViewCount(video.statistics.viewCount)}
                              </Typography>
                            )}
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(video.snippet.publishedAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Load More Button */}
            {pageToken && !loading && (
              <Box mt={4} display="flex" justifyContent="center">
                <Button 
                  variant="outlined" 
                  onClick={() => fetchVideos(pageToken)}
                  startIcon={<RefreshIcon />}
                >
                  Load More
                </Button>
              </Box>
            )}
            
            {/* Loading Indicator for Load More */}
            {loading && videos.length > 0 && (
              <Box mt={4} display="flex" justifyContent="center">
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default AllVideos;
