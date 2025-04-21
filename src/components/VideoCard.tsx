import React from 'react';
import { formatDate } from '../utils/format';
import Link from 'next/link';
import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import { AccessTime, MoreVert } from '@mui/icons-material';

interface YouTubeVideo {
  id: {
    videoId: string;
  } | string;
  snippet?: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
  // Fallback properties
  title?: string;
  description?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  channelTitle?: string;
}

interface VideoCardProps {
  video: YouTubeVideo;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  // Use stable demo values instead of random ones
  const demoDuration = '10:30';
  const demoViews = '1,234,567';
  
  // Handle both API response format and fallback data format
  const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
  const title = video.snippet?.title || video.title || '';
  const description = video.snippet?.description || video.description || '';
  const publishedAt = video.snippet?.publishedAt || video.publishedAt || '';
  const thumbnailUrl = video.snippet?.thumbnails?.high?.url || video.thumbnailUrl || '';
  const channelTitle = video.snippet?.channelTitle || video.channelTitle || '';
  
  return (
    <Box 
      sx={{ 
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          '& .video-title': {
            color: '#065fd4',
          },
        },
      }}
    >
      <Link href={`/videos/${videoId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Thumbnail with duration overlay */}
        <Box sx={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
          <img
            src={thumbnailUrl}
            alt={title}
            style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              objectFit: 'cover',
              display: 'block',
            }}
          />
          
          {/* Duration overlay */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: '8px', 
              right: '8px', 
              bgcolor: 'rgba(0, 0, 0, 0.8)', 
              color: 'white',
              px: 0.5,
              py: 0.25,
              borderRadius: '2px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AccessTime sx={{ fontSize: '12px', mr: 0.5 }} />
            {demoDuration}
          </Box>
        </Box>
        
        {/* Video info */}
        <Box sx={{ display: 'flex', mt: 1 }}>
          {/* Channel avatar */}
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              mr: 1,
              bgcolor: 'primary.main',
              fontSize: '14px',
            }}
          >
            {channelTitle.charAt(0)}
          </Avatar>
          
          {/* Video details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              className="video-title"
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500, 
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.2',
                fontSize: '14px',
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '12px',
                mb: 0.5,
              }}
            >
              {channelTitle}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {demoViews} views • {formatDate(publishedAt)}
            </Typography>
          </Box>
          
          {/* More options button */}
          <Tooltip title="More options">
            <Box sx={{ ml: 1, color: 'text.secondary' }}>
              <MoreVert sx={{ fontSize: '20px' }} />
            </Box>
          </Tooltip>
        </Box>
      </Link>
    </Box>
  );
};

export default VideoCard; 