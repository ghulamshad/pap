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
} from "@mui/material";
import { useRouter } from "next/navigation";

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: { url: string };
    };
  };
}

const API_KEY = "AIzaSyBGhf4ENxxtt5LfW5sDSD65wAtMfu3yQpQ"; 
const CHANNEL_ID = "UCUfE_2MHtAl1VIvpxoYBROA";

const YoutubeFeed: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [liveStream, setLiveStream] = useState<VideoItem | null>(null);
  const router = useRouter();
  const fetchVideos = async () => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`
    );
    const data = await res.json();
    setVideos(data.items || []);
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

  useEffect(() => {
    fetchVideos();
    fetchLiveStream();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Live Stream Section */}
      <Typography variant="h4" gutterBottom>
        📡 Live Stream
      </Typography>

      {liveStream ? (
        <Box mb={6}>
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%", // 16:9
            }}
          >
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

      {/* Latest Videos Section */}
      <Typography variant="h4" gutterBottom>
        📺 Latest Videos
      </Typography>

      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid sx={{xs:12, sm:6, md:4 }} key={video.id.videoId}>
            <Card elevation={3}>
              <CardMedia
                component="iframe"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                height="200"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <CardContent>
                <Typography variant="subtitle1">
                  {video.snippet.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => router.push("/videos")}>
          View All Videos
        </Button>
      </Box>
    </Container>
  );
};

export default YoutubeFeed;
