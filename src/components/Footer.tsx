import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  // useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Phone,
  Email,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#0D5B2E',
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  '&:hover': {
    textDecoration: 'underline',
  },
}));

// const SocialIcon = styled(IconButton)(({ theme }) => ({
//   color: theme.palette.primary.contrastText,
//   marginRight: theme.spacing(1),
//   '&:hover': {
//     backgroundColor: theme.palette.primary.dark,
//   },
// }));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const SocialLinks = () => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Link
        href="https://www.facebook.com/profile.php?id=61557083872510"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton color="inherit">
          <Facebook />
        </IconButton>
      </Link>
      <Link
        href="https://x.com/paplahore"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton color="inherit">
          <Twitter />
        </IconButton>
      </Link>
      <Link
        href="https://www.instagram.com/provincialassemblyofpunjab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton color="inherit">
          <Instagram />
        </IconButton>
      </Link>
      <Link
        href="https://www.youtube.com/@ProvincialAssemblyofPunjab"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton color="inherit">
          <YouTube />
        </IconButton>
      </Link>
    </Box>
  );
};

const Footer: React.FC = () => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const quickLinks = [
    { text: 'Home', href: '/' },
    { text: 'About Assembly', href: '/about-assembly' },
    { text: 'About Secretariat', href: '/about-secretariat' },
    { text: 'Committees', href: '/committees' },
    { text: 'Legislation', href: '/legislation' },
    { text: 'Contact Us', href: '/contact' },
  ];

  const importantLinks = [
    { text: 'Rules of Procedure', href: '/about-assembly/rules' },
    { text: 'Parliamentary Privileges', href: '/about-assembly/privileges' },
    { text: 'Directory', href: '/about-secretariat/directory' },
    { text: 'RTI', href: '/about-secretariat/rti' },
    { text: 'Budget', href: '/about-secretariat/budget' },
  ];

  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Quick Links */}
          <Grid sx={{xs:12, sm:6, md:3}}>
            <FooterSection>
              <FooterTitle variant="h6">Quick Links</FooterTitle>
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <StyledLink>
                    {link.text}
                  </StyledLink>
                </Link>
              ))}
            </FooterSection>
          </Grid>

          {/* Important Links */}
          <Grid sx={{xs:12, sm:6, md:3}}>
            <FooterSection>
              <FooterTitle variant="h6">Important Links</FooterTitle>
              {importantLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <StyledLink>
                    {link.text}
                  </StyledLink>
                </Link>
              ))}
            </FooterSection>
          </Grid>

          {/* Contact Information */}
          <Grid sx={{xs:12, sm:6, md:3}}>
            <FooterSection>
              <FooterTitle variant="h6">Contact Us</FooterTitle>
              <ContactItem>
                <LocationOn />
                <Typography variant="body2">
                  Provincial Assembly of the Punjab, Lahore
                </Typography>
              </ContactItem>
              <ContactItem>
                <Phone />
                <Typography variant="body2">+92 42 99200101-5</Typography>
              </ContactItem>
              <ContactItem>
                <Email />
                <Typography variant="body2">info@pap.gov.pk</Typography>
              </ContactItem>
              <ContactItem>
                <AccessTime />
                <Typography variant="body2">
                  Monday - Friday: 9:00 AM - 5:00 PM
                </Typography>
              </ContactItem>
            </FooterSection>
          </Grid>

          {/* Social Media & Newsletter */}
          <Grid sx={{xs:12, sm:6, md:3}}>
            <FooterSection>
              <FooterTitle variant="h6">Connect With Us</FooterTitle>
              <Box sx={{ mb: 3 }}>
                <SocialLinks />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Subscribe to our newsletter for updates
              </Typography>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    flex: 1,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    cursor: 'pointer',
                  }}
                >
                  Subscribe
                </button>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Provincial Assembly of the Punjab. All rights reserved.
          </Typography>
          <Box>
            <Link href="/privacy-policy" passHref>
              <StyledLink sx={{ display: 'inline', mr: 2 }}>
                Privacy Policy
              </StyledLink>
            </Link>
            <Link href="/terms-of-service" passHref>
              <StyledLink sx={{ display: 'inline' }}>
                Terms of Service
              </StyledLink>
            </Link>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 