import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Container,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
}

const API_KEY = "AIzaSyB016n4M9H5PEVO74rTfbMQvxdViVocpRg";
const CHANNEL_ID = "UCUfE_2MHtAl1VIvpxoYBROA";

const YoutubeFeed: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [liveStream, setLiveStream] = useState<VideoItem | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const router = useRouter();

  const fetchVideos = async (token: string | null = null) => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50${token ? `&pageToken=${token}` : ""}`
    );
    const data = await res.json();
    const newItems: VideoItem[] = data.items || [];

    // Filter by year if needed
    const filtered =
      selectedYear === "All"
        ? newItems
        : newItems.filter((item) => item.snippet.publishedAt.startsWith(selectedYear));

    setVideos((prev) => (token ? [...prev, ...filtered] : filtered));
    setPageToken(data.nextPageToken || null);
  };

  const fetchLiveStream = async () => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&eventType=live&type=video`
    );
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      setLiveStream(data.items[0]);
    }
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    const year = event.target.value;
    setSelectedYear(year);
    setVideos([]);
    setPageToken(null);
  };

  useEffect(() => {
    fetchVideos();
    fetchLiveStream();
  }, [selectedYear]);

  // Create year options based on existing video years or manually
  const yearOptions = ["All", "2025", "2024", "2023", "2022", "2021"];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Live Stream Section */}
      <Typography variant="h4" gutterBottom>
        📡 Live Stream
      </Typography>

      {liveStream ? (
        <Box mb={6}>
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            {liveStream.snippet.title}
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary" mb={6}>
          No live stream is currently active.
        </Typography>
      )}

      {/* Filter + Latest Videos */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">📺 Latest Videos</Typography>
        <Select size="small" value={selectedYear} onChange={handleYearChange}>
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <Card elevation={3}>
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
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {video.snippet.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pageToken && (
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="outlined" onClick={() => fetchVideos(pageToken)}>
            Load More
          </Button>
        </Box>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => router.push("/videos")}>
          View All Videos
        </Button>
      </Box>
    </Container>
  );
};

export default YoutubeFeed;
