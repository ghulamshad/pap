'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Description as DocumentIcon, 
  Event as EventIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { RootState } from '@/redux/store';
import { fetchUserRequest } from '@/redux/slices/userSlice';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { profile, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      dispatch(fetchUserRequest());
    }
  }, [isAuthenticated, router, dispatch]);

  if (!isAuthenticated || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Get the highest role from the user's roles array
  const userRoles = user?.roles || [];
  const userRole = userRoles.length > 0 ? userRoles[0].name : 'USER';
  const isAdmin = userRole === 'ADMIN';
  const isModerator = userRole === 'MODERATOR' || isAdmin;
  const isEditor = userRole === 'EDITOR' || isModerator;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid sx={{ xs: 12 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.email?.split('@')[0] || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Role: {userRole}
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid sx={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Profile
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => router.push('/profile')}>
                      View Profile
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              {isEditor && (
                <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Documents
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push('/documents')}>
                        Manage Documents
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )}
              
              {isModerator && (
                <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Users
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push('/users')}>
                        Manage Users
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )}
              
              {isAdmin && (
                <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Roles
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push('/roles')}>
                        Manage Roles
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid sx={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile Updated" 
                  secondary="2 hours ago"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="New Document Added" 
                  secondary="5 hours ago"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Meeting Scheduled" 
                  secondary="1 day ago"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* User Information */}
        <Grid sx={{ xs: 12 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email || 'Not provided'}
                </Typography>
                <Typography variant="body1">
                  <strong>Role:</strong> {userRole}
                </Typography>
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Last Login:</strong> {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Created:</strong> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 