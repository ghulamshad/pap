'use client';

import { Box, Container, Typography, Grid, Card, CardContent, Button,Breadcrumbs,Link as MuiLink, } from '@mui/material';
import React, { Suspense, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import Hero from '@/components/Hero';
import { LoadingScreen } from '@/components/LoadingScreen';
import ParliamentaryResources from '@/components/ParliamentaryResources';
import YoutubeFeed from '@/components/YoutubeFeed';
import Footer from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import Link from 'next/link';



const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  '& .MuiBreadcrumbs-separator': {
    margin: theme.spacing(0, 1),
  },
  '& .MuiLink-root': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px - 64px)', // Subtract header and footer height
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
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

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(6, 0),
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px !important',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const breadcrumbs = useMemo(() => {
    const pathnames = pathname ? pathname.split('/').filter((x) => x) : [];
    return pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

      return last ? (
        <Typography key={to} color="text.primary">
          {label}
        </Typography>
      ) : (
        <MuiLink
          component={Link}
          href={to}
          key={to}
          color="inherit"
          underline="hover"
        >
          {label}
        </MuiLink>
      );
    });
  }, [pathname]);
  const isHomePage = useMemo(() => pathname === '/', [pathname]);

  return (
    
    <ErrorBoundary>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        position: 'relative',
      }}>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <ContentWrapper>
          
          {/* Hero Section for Home Page */}
          {isHomePage && <Hero />}

          {/* Speakers Section for Home Page */}
          {/* {isHomePage && <SpeakersSection />} */}

          {/* Breadcrumbs */}
          {!isHomePage && (
            <StyledBreadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <MuiLink component={Link} href="/" color="inherit" underline="hover">
                Home
              </MuiLink>
              {breadcrumbs}
            </StyledBreadcrumbs>
          )}

          {/* Main Content Area */}
          <MainContent>
            <StyledContainer>
              <Suspense fallback={<LoadingScreen />}>
                {isHomePage ? (
                  <>
                  {/* <News /> */}
                  <ParliamentaryResources />
                  <YoutubeFeed/>
                    {/* <MembersSection /> */}
                   {/* <LatestNewsSection /> */}
                   {/* <NewsSection /> */}
                    {/* <PublicationsSection /> */}
                   {/* <EventsSection /> */}
                   {/* <AssemblyBusinessSection />  */}
                   {/* <FAQSection /> */}
                   {/* <LegislativeSection /> */}
                   {/* <HighlightsSection /> */}
                   {/* <AboutGovtSection /> */}
                  {/* <ParliamentaryCalendarSection /> */}
                  {/* <PressReleaseSection />  */}
                  {/* <CommitteeSection /> */}
                  {/* <PerformanceSection />   */}
                  {/* <PunjabLawSection /> */}
                  {/* <BillsSection /> */}
                  {/* <NotificationSection /> */}
                  {/* <TodayInAssemblySection /> */}
                   


                  </>

                ) : (
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      Welcome to the Dashboard
                    </Typography>
                    <Typography variant="body1">
                      Please navigate to a specific section using the sidebar.
                    </Typography>
                  </Box>
                )}
              </Suspense>
            </StyledContainer>
          </MainContent>
        </ContentWrapper>

        {/* Footer */}
        <Footer />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </Box>
    </ErrorBoundary>
  );
}
