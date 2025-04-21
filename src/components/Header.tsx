import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  InputBase,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Collapse,
  Tooltip,
  Badge,
  useScrollTrigger,
  Slide,
  Grid,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  ExpandMore,
  ExpandLess,
  Notifications,
  AccountCircle,
  Language,
  Email,
  Phone,
  
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Top Bar Styling
const TopBar = styled(Box)(({ theme }) => ({
  // background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundColor: '#0D5B2E',
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 0),
  fontSize: '0.675rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: `0 2px 4px ${alpha(theme.palette.primary.dark, 0.2)}`,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const TopBarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& a': {
    color: theme.palette.common.white,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
}));

// Main Header Styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
  backdropFilter: 'blur(8px)',
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  width: '100%',
  maxWidth: '100%',
  '& .MuiToolbar-root': {
    // padding: theme.spacing(1, 0),
    minHeight: '64px !important',
  },
  '& .MuiContainer-root': {
    maxWidth: '1400px !important',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
}));

// Logo Container
const LogoContainer = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textDecoration: 'none',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
    transform: 'translateY(-2px)',
  },
  '& img': {
    // height: 20,
    transition: 'transform 0.3s ease',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

// Social Media Links Styling
const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginRight: theme.spacing(2),
  '& a': {
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    padding: theme.spacing(0.5),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateY(-2px)',
    },
  },
}));

// Search bar styling
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

// Mega Menu Styling
const MegaMenuContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: theme.zIndex.appBar + 2,
  '&:hover': {
    '& > .mega-menu-content': {
      display: 'block',
      opacity: 1,
      transform: 'translateY(0)',
      visibility: 'visible',
      backgroundColor: '#0D5B2E',
    },
  },
}));

const MegaMenuTrigger = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 2),
  whiteSpace: 'nowrap',
  minWidth: 'auto',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5, 1),
  },
}));

const MegaMenuContent = styled(Box)(({ theme }) => ({
  display: 'none',
  position: 'fixed',
  top: 'auto',
  left: 0,
  right: 0,
  width: '100%',
  background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
  backdropFilter: 'blur(8px)',
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  zIndex: theme.zIndex.appBar + 3,
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease-in-out',
  borderTop: `2px solid ${theme.palette.primary.main}`,
  visibility: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 10,
    background: 'transparent',
  },
  '& .MuiContainer-root': {
    maxWidth: '1400px !important',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
}));

const MegaMenuGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '1400px',
  margin: '0 auto',
  '& .MuiGrid-item': {
    [theme.breakpoints.down('md')]: {
      flexBasis: '50%',
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '100%',
    },
  },
}));

const MegaMenuItem = styled(Link)(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1, 2),
  color: theme.palette.text.primary,
  textDecoration: 'none',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  fontSize: '0.875rem',
  background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
  '&:hover': {
    background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
    color: theme.palette.primary.main,
    transform: 'translateX(4px)',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5, 1),
  },
}));

const MegaMenuTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Custom Menu Component
const CustomMenu: React.FC<{
  title: string;
  items: { text: string; href: string }[];
}> = ({ title, items }) => {
  const pathname = usePathname() || '';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box>
        <Button
          color="inherit"
          sx={{
            color: pathname.includes(title.toLowerCase().replace(/\s+/g, '-'))
              ? theme.palette.primary.main
              : 'inherit',
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            px: 2,
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Button>
      </Box>
    );
  }

  return (
    <MegaMenuContainer>
      <MegaMenuTrigger
        sx={{
          color: pathname.includes(title.toLowerCase().replace(/\s+/g, '-'))
            ? theme.palette.primary.main
            : 'inherit',
          fontSize: '0.875rem',
          px: 2,
          py: 1,
        }}
      >
        {title}
      </MegaMenuTrigger>
      <MegaMenuContent className="mega-menu-content">
        <MegaMenuTitle>{title}</MegaMenuTitle>
        <MegaMenuGrid container spacing={2}>
          {items.map((item) => (
            <Grid sx={{xs:12, sm:6, md:3}} key={item.href}>
              <MegaMenuItem
                href={item.href}
                sx={{
                  color: pathname === item.href
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  fontSize: '0.875rem',
                  py: 1,
                }}
              >
                {item.text}
              </MegaMenuItem>
            </Grid>
          ))}
        </MegaMenuGrid>
      </MegaMenuContent>
    </MegaMenuContainer>
  );
};

// Navigation items
const navigationItems = [
  {
    title: 'About Assembly',
    items: [
      { text: 'Messages', href: '/about-assembly/messages' },
      { text: 'Overview', href: '/about-assembly/overview' },
      { text: 'Functions', href: '/about-assembly/functions' },
      { text: 'Leader of the House', href: '/about-assembly/leaders/loh' },
      { text: 'Leader of the Opposition', href: '/about-assembly/leaders/loo' },
      { text: 'Cabinet and Functionaries', href: '/about-assembly/cabinet' },
      { text: 'Rules of Procedure', href: '/about-assembly/rules' },
      { text: 'Parliamentary Privileges', href: '/about-assembly/privileges' },
      { text: 'Building', href: '/about-assembly/building' },
    ],
  },
  {
    title: 'About Secretariat',
    items: [
      { text: 'Overview', href: '/about-secretariat/overview' },
      { text: 'Organizational Setup', href: '/about-secretariat/setup' },
      { text: 'Organizational Chart', href: '/about-secretariat/chart' },
      { text: 'Officers of the House', href: '/about-secretariat/officers' },
      { text: 'Directory', href: '/about-secretariat/directory' },
      { text: 'Powers & Functions', href: '/about-secretariat/powers' },
      { text: 'Contact List', href: '/about-secretariat/contact' },
      { text: 'Rules', href: '/about-secretariat/rules' },
      { text: 'RTI', href: '/about-secretariat/rti' },
      { text: 'Budget', href: '/about-secretariat/budget' },
      { text: 'Sanctioned Posts', href: '/about-secretariat/sanctioned-posts' },
      { text: 'Assembly Library', href: '/about-secretariat/library' },
      { text: 'Public Information Officers', href: '/about-secretariat/pio' },
      { text: 'Parliamentary Development Unit', href: '/about-secretariat/pdu' },
    ],
  },
  {
    title: 'Members',
    items: [
      { text: 'Speakers', href: '/members/speakers' },
      { text: 'Deputy Speakers', href: '/members/deputy-speakers' },
      { text: "Members' Directory", href: '/members/directory' },
      { text: 'Birthday Today', href: '/members/birthday' },
      { text: "Members' Attendance", href: '/members/attendance' },
      { text: 'Address List of Members', href: '/members/address-list' },
      { text: 'Past Members', href: '/members/past' },
      { text: 'Notifications', href: '/members/notifications' },
    ],
  },
  {
    title: 'Committees',
    items: [
      { text: 'Committee System', href: '/committees/system' },
      { text: 'Committee Rules', href: '/committees/rules' },
      { text: 'Standing Committees for Government Departments', href: '/committees/standing' },
      { text: 'Others Standing Committees', href: '/committees/others-standing' },
      { text: 'Other Committees', href: '/committees/other' },
      { text: 'Special Committees', href: '/committees/special' },
      { text: 'Parliamentary Caucuses', href: '/committees/caucuses' },
      { text: 'Notifications', href: '/committees/notifications' },
      { text: 'Reports (Laid)', href: '/committees/reports' },
    ],
  },
  {
    title: 'Assembly Business',
    items: [
      { text: 'Consolidated Business', href: '/assembly-business/consolidated' },
      { text: 'Order of the Day (Agenda)', href: '/assembly-business/agenda' },
      { text: 'Summary of Proceedings', href: '/assembly-business/summary' },
      { text: 'Verbatim Debates', href: '/assembly-business/debates' },
      { text: 'Questions', href: '/assembly-business/questions' },
      { text: 'Resolutions Passed', href: '/assembly-business/resolutions' },
      { text: 'Legislative Procedure', href: '/assembly-business/legislative' },
      { text: 'Bills', href: '/assembly-business/bills' },
      { text: 'Performance of the Assembly', href: '/assembly-business/performance' },
      { text: 'Notifications', href: '/assembly-business/notifications' },
      { text: 'Punjab Gazette', href: '/assembly-business/gazette' },
      { text: 'Audio Video Live (YouTube)', href: 'https://www.youtube.com/@ProvincialAssemblyofPunjab' },
      { text: 'Audio Video (Archive)', href: '/assembly-business/archive' },
    ],
  },
  {
    title: 'Media Center',
    items: [
      { text: 'Press Releases', href: '/media-center/press-releases' },
      { text: 'Notifications', href: '/media-center/notifications' },
      { text: 'News & Activities', href: '/media-center/news' },
      { text: 'Picture Gallery', href: '/media-center/gallery' },
      { text: 'Tenders', href: '/media-center/tenders' },
      { text: 'Jobs', href: '/media-center/jobs' },
      { text: 'Press Gallery Committee', href: '/media-center/press-gallery' },
      { text: 'Downloads', href: '/media-center/downloads' },
    ],
  },
  {
    title: 'Reports & Publications',
    items: [
      { text: 'Reports', href: '/reports-publications/reports' },
      { text: 'Publications', href: '/reports-publications/publications' },
      { text: 'Rulings of the Chair', href: '/reports-publications/rulings' },
    ],
  },
  {
    title: 'Videos',
    items: [
      { text: 'All Videos', href: '/videos' },
      // { text: 'Featured Videos', href: '/videos?featured=true' },
      // { text: 'Latest Videos', href: '/videos?sort=latest' },
      // { text: 'Most Viewed', href: '/videos?sort=most-viewed' },
    ],
  },
  {
    title: 'CPA Regional Conference 2025',
    items: [
      { text: 'Welcome Messages', href: '/cpa-conference-2025/welcome' },
      { text: 'Conference Programme', href: '/cpa-conference-2025/programme' },
      { text: 'CPA Event Page', href: 'https://www.cpahq.org/news/2025_02-asia-south-east-asia-regional-conference/' },
      { text: 'Participating Delegates', href: '/cpa-conference-2025/delegates' },
      { text: 'Conference Book', href: '/cpa-conference-2025/book' },
      { text: 'Important Visa Information', href: '/cpa-conference-2025/visa' },
      { text: 'Constitution - CPA Asia Region', href: '/cpa-conference-2025/constitution' },
      { text: 'Lahore Charter', href: '/cpa-conference-2025/charter' },
      { text: 'Feedback Form', href: '/cpa-conference-2025/feedback' },
      { text: 'Picture Gallery', href: '/cpa-conference-2025/gallery' },
    ],
  },
];

// Update NavigationMenuContainer definition
const NavigationMenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pb: 1,
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  mt: 1,
  position: 'relative',
  gap: theme.spacing(1),
  flexWrap: 'nowrap',
  overflowX: 'auto',
  width: '100vw',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '& > *': {
    position: 'relative',
    flexShrink: 0,
  },
  background: '#0D5B2E',
  color: '#FFFFFF',
  borderRadius: 0,
  padding: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 0),
  },
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname() || '';
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: '100%', maxWidth: '100%'  }}>
      <List>
        {navigationItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem onClick={() => handleMenuClick(item.title)}>
              <ListItemText primary={item.title} />
              {expandedMenu === item.title ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expandedMenu === item.title} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.items.map((subItem) => (
                  <ListItem
                    key={subItem.href}
                    component={Link}
                    href={subItem.href}
                    sx={{ 
                      pl: 4,
                      backgroundColor: pathname === subItem.href ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    }}
                  >
                    <ListItemText 
                      primary={subItem.text}
                      primaryTypographyProps={{
                        color: pathname === subItem.href ? 'primary' : 'textPrimary',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* <TopBar>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <TopBarItem>
              <a href="mailto:info@pap.gov.pk">
                <Email fontSize="small" />
                info@pap.gov.pk
              </a>
              <a href="tel:+924299211111">
                <Phone fontSize="small" />
                +92 42 99211111
              </a>
            </TopBarItem>
            <TopBarItem>
              <a href="https://www.pap.gov.pk/public/home/ur">
                <Language fontSize="small" />
                اردو
              </a>
            </TopBarItem>
          </Box>
        </Container>
      </TopBar> */}

      <Slide appear={false} direction="down" in={!trigger}>
        <StyledAppBar position="sticky" color="default" elevation={1}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <LogoContainer href="/">
                <Box
                  component="img"
                  src="/punjab-assembly-logo.png"
                  alt="PAP Logo"
                  sx={{
                    width: { xs: 150, sm: 20, md: 30 },
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
                {/* <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div" sx={{fontSize:12, fontWeight: 'bold' }}>
                    Provincial Assembly
                  </Typography>
                  <Typography variant="subtitle2" component="div" color="primary">
                    of the Punjab
                  </Typography>
                </Box> */}
              </LogoContainer>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
              <Typography variant="h6" component="div" sx={{ fontSize:{ sm: '1rem', md: '2rem' }, fontWeight: 'bold',color:'#0D5B2E' }}>
                    Provincial Assembly of the Punjab
                  </Typography>

                  
                </Box>
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                  <SocialLinks>
                    <Tooltip title="Facebook">
                      <a href="https://www.facebook.com/profile.php?id=61557083872510" target="_blank" rel="noopener noreferrer">
                        <Facebook />
                      </a>
                    </Tooltip>
                    <Tooltip title="Twitter">
                      <a href="https://x.com/paplahore" target="_blank" rel="noopener noreferrer">
                        <Twitter />
                      </a>
                    </Tooltip>
                    <Tooltip title="Instagram">
                      <a href="https://www.instagram.com/provincialassemblyofpunjab" target="_blank" rel="noopener noreferrer">
                        <Instagram />
                      </a>
                    </Tooltip>
                    <Tooltip title="YouTube">
                      <a href="https://www.youtube.com/@ProvincialAssemblyofPunjab" target="_blank" rel="noopener noreferrer">
                        <YouTube />
                      </a>
                    </Tooltip>
                  </SocialLinks>

                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </Search>

                  {isAuthenticated && (
                    <>
                      <Tooltip title="Notifications">
                        <IconButton color="primary">
                          <Badge badgeContent={3} color="error">
                            <Notifications />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Account">
                        <IconButton
                          onClick={handleProfileMenuOpen}
                          color="primary"
                        >
                          <AccountCircle />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              )}

              {isMobile && (
                <IconButton
                  color="primary"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 'auto' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>

            {!isMobile && (
              <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
                <NavigationMenuContainer>
                  {navigationItems.map((item) => (
                    <CustomMenu
                      key={item.title}
                      title={item.title}
                      items={item.items}
                    />
                  ))}
                </NavigationMenuContainer>
              </Box>
            )}
          </Container>
        </StyledAppBar>
      </Slide>

      {isAuthenticated && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} href="/profile">Profile</MenuItem>
          <MenuItem component={Link} href="/settings">Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
        </Menu>
      )}

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
