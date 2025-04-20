'use client';

import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";
import Header from "@/components/Header";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AllVideos from "@/components/AllVideos";
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

export default function Videos() {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <Typography color="text.primary">Videos</Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" gutterBottom>
            Videos
          </Typography>
          <AllVideos />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}