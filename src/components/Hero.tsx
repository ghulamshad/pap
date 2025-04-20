import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '80vh',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
  [theme.breakpoints.down('sm')]: {
    height: '50vh',
  },
}));

const HeroSlide = styled(Box)<{ $active: boolean }>(({ $active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: $active ? 1 : 0,
  transition: 'opacity 0.5s ease-in-out',
  '& .hero-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const HeroOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to right, ${alpha(theme.palette.common.black, 0.7)} 0%, ${alpha(theme.palette.common.black, 0.3)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: theme.palette.common.white,
  textAlign: 'left',
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
  },
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SlideIndicators = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 2,
}));

const Indicator = styled(Box)<{ $active: boolean }>(({ theme, $active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: $active ? theme.palette.common.white : alpha(theme.palette.common.white, 0.5),
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}));

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    '/hero/a1.jpeg',
    '/hero/a2.jpeg',
    '/hero/a3.jpeg',
    '/hero/a4.jpeg',
    '/hero/a5.jpeg',
    '/hero/a6.jpeg',
    '/hero/a7.jpeg',
    '/hero/a8.jpeg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <HeroContainer>
      {heroImages.map((image, index) => (
        <HeroSlide key={image} $active={index === currentSlide}>
          <Image 
            src={image} 
            alt={`Hero slide ${index + 1}`} 
            fill
            className="hero-image"
            priority={index === 0}
          />
        </HeroSlide>
      ))}
      
      <HeroOverlay>
        <HeroContent>
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Welcome to the Provincial Assembly of Punjab
          </Typography>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            paragraph
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Discover the legislative body that represents the people of Punjab, Pakistan.
          </Typography>
          <Button
            component={Link}
            href="/about"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mr: 2,
              mb: { xs: 2, sm: 0 },
              fontWeight: 'bold',
            }}
          >
            Learn More
          </Button>
          <Button
            component={Link}
            href="/contact"
            variant="outlined"
            color="inherit"
            size="large"
            sx={{
              fontWeight: 'bold',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Contact Us
          </Button>
        </HeroContent>
      </HeroOverlay>

      <NavigationButton
        onClick={handlePrevSlide}
        sx={{ left: theme.spacing(2) }}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </NavigationButton>
      <NavigationButton
        onClick={handleNextSlide}
        sx={{ right: theme.spacing(2) }}
        aria-label="Next slide"
      >
        <ChevronRight />
      </NavigationButton>

      <SlideIndicators>
        {heroImages.map((_, index) => (
          <Indicator
            key={index}
            $active={index === currentSlide}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </SlideIndicators>
    </HeroContainer>
  );
};

export default Hero; 