import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  alpha,
  Link,
  Tooltip,
  CircularProgress,
  Alert,
  Zoom,
  Container,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Facebook, 
  Twitter, 
  LinkedIn, 
  Email, 
  ArrowForward,
  Instagram,
  Language,
  ArrowBack,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { publicApiService } from '../../services/publicApiService';
import { ApiResponse } from '../../types/api.types';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
}));

const SpeakerCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const SpeakerImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '300px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
}));

const SpeakerImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const SpeakerInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  color: '#fff',
  zIndex: 1,
}));

const SpeakerName = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
}));

const SpeakerTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  opacity: 0.9,
  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
}));

const MessageContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const MessageText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  flexGrow: 1,
  fontStyle: 'italic',
  position: 'relative',
  padding: theme.spacing(2),
  '&::before': {
    content: '"""',
    fontSize: '3rem',
    color: alpha(theme.palette.primary.main, 0.2),
    position: 'absolute',
    top: -10,
    left: 0,
  },
}));

const ActionLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
}));

const SocialLinks = styled(Stack)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& a': {
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    padding: theme.spacing(1),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      transform: 'translateY(-2px)',
    },
  },
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.shape.borderRadius,
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  '& .react-swipeable-view-container': {
    height: '100%',
  },
}));

const SliderNavigation = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  transform: 'translateY(-50%)',
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  zIndex: 2,
  pointerEvents: 'none',
  '& button': {
    pointerEvents: 'auto',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const SliderDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const SliderDot = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface SpeakerMessage {
  id: number;
  content: string;
  speaker: {
    name: string;
    imageUrl: string;
    designation: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      website?: string;
    };
  };
}

interface DeputySpeakerMessage {
  id: number;
  content: string;
  deputySpeaker: {
    name: string;
    imageUrl: string;
    designation: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      website?: string;
    };
  };
}

const SpeakersSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [speakerMessage, setSpeakerMessage] = useState<SpeakerMessage | null>(null);
  const [deputySpeakerMessage, setDeputySpeakerMessage] = useState<DeputySpeakerMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [speakerResponse, deputySpeakerResponse] = await Promise.all([
          publicApiService.get<ApiResponse<SpeakerMessage>>('/api/v1/speaker-message'),
          publicApiService.get<ApiResponse<DeputySpeakerMessage>>('/api/v1/deputy-speaker-message')
        ]);
        
        if (speakerResponse.data.data) {
          setSpeakerMessage(speakerResponse.data.data);
        }
        
        if (deputySpeakerResponse.data.data) {
          setDeputySpeakerMessage(deputySpeakerResponse.data.data);
        }
      } catch (err) {
        setError('Failed to load speaker messages');
        console.error('Error fetching speaker messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % 2);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + 2) % 2);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  if (loading) {
    return (
      <SectionContainer>
        <ContentWrapper>
          <LoadingContainer>
            <CircularProgress size={60} />
          </LoadingContainer>
        </ContentWrapper>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <ContentWrapper>
          <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
            {error}
          </Alert>
        </ContentWrapper>
      </SectionContainer>
    );
  }

  const messages = [
    { type: 'speaker', data: speakerMessage },
    { type: 'deputySpeaker', data: deputySpeakerMessage },
  ].filter(item => item.data !== null);

  return (
    <SectionContainer>
      <ContentWrapper>
        <SectionTitle>Leadership Messages</SectionTitle>
        <SectionSubtitle>
          Insights and perspectives from the Speaker and Deputy Speaker of the Punjab Assembly
        </SectionSubtitle>
        
        <SliderContainer>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            interval={5000}
          >
            {messages.map((message, index) => (
              <Box key={index} sx={{ p: 1 }}>
                <SpeakerCard>
                  <SpeakerImageContainer>
                    <SpeakerImage 
                      src={message.type === 'speaker' 
                        ? message.data.speaker.imageUrl 
                        : message.data.deputySpeaker.imageUrl || '/images/placeholder-speaker.jpg'} 
                      alt={message.type === 'speaker' 
                        ? message.data.speaker.name 
                        : message.data.deputySpeaker.name} 
                    />
                    <SpeakerInfo>
                      <SpeakerName>
                        {message.type === 'speaker' 
                          ? message.data.speaker.name 
                          : message.data.deputySpeaker.name}
                      </SpeakerName>
                      <SpeakerTitle>
                        {message.type === 'speaker' 
                          ? message.data.speaker.designation 
                          : message.data.deputySpeaker.designation}
                      </SpeakerTitle>
                    </SpeakerInfo>
                  </SpeakerImageContainer>
                  
                  <MessageContent>
                    <MessageText>
                      {message.data.content}
                    </MessageText>
                    
                    <ActionLinks>
                      <ReadMoreButton 
                        variant="contained" 
                        color="primary"
                        endIcon={<ArrowForward />}
                      >
                        Read Full Message
                      </ReadMoreButton>
                      
                      <SocialLinks direction="row">
                        {(message.type === 'speaker' 
                          ? message.data.speaker.socialLinks 
                          : message.data.deputySpeaker.socialLinks)?.facebook && (
                          <Tooltip title="Facebook">
                            <Link 
                              href={message.type === 'speaker' 
                                ? message.data.speaker.socialLinks.facebook 
                                : message.data.deputySpeaker.socialLinks.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Facebook />
                            </Link>
                          </Tooltip>
                        )}
                        {/* ... Similar pattern for other social links ... */}
                      </SocialLinks>
                    </ActionLinks>
                  </MessageContent>
                </SpeakerCard>
              </Box>
            ))}
          </AutoPlaySwipeableViews>

          <SliderNavigation>
            <IconButton 
              onClick={handleBack}
              sx={{ 
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': { backgroundColor: theme.palette.background.paper }
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton 
              onClick={handleNext}
              sx={{ 
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': { backgroundColor: theme.palette.background.paper }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </SliderNavigation>
        </SliderContainer>

        <SliderDots>
          {messages.map((_, index) => (
            <SliderDot
              key={index}
              active={index === activeStep}
              onClick={() => handleStepChange(index)}
            />
          ))}
        </SliderDots>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default SpeakersSection; 