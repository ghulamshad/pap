'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Person, Email, Lock, Save, Cancel, Edit, PhotoCamera } from '@mui/icons-material';
import { RootState } from '@/redux/store';
import { apiService } from '@/utils/apiService';
import { User } from '@/types/user';
import { updateUserSuccess } from '@/redux/slices/userSlice';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile: user, loading, error } = useSelector((state: RootState) => state.user);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
      });
    } else {
      // Fetch user profile if not in Redux store
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      setFormData({
        ...formData,
        name: profile.name || '',
        email: profile.email || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      
      if (!formData.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
        };
        
        if (isChangingPassword) {
          updateData.currentPassword = formData.currentPassword;
          updateData.newPassword = formData.newPassword;
        }
        
        const updatedUser = await apiService.updateProfile(updateData);
        dispatch(updateUserSuccess(updatedUser));
        
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setIsChangingPassword(false);
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error: any) {
        console.error('Error updating profile:', error);
        setFormErrors({
          ...formErrors,
          currentPassword: error.response?.data?.error || 'Failed to update profile',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setFormErrors({});
    
    // Reset form data to current user data
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
      <Fade in timeout={300}>
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                  </Alert>
                )}

                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box position="relative">
                    <Avatar
                      sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user?.name ? getInitials(user.name) : <Person />}
                    </Avatar>
                    <Tooltip title="Change photo">
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { bgcolor: 'background.paper' },
                        }}
                      >
                        <PhotoCamera fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {user?.name || 'User Profile'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your profile information
                    </Typography>
                  </Box>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid sx={{ xs:12}}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid sx={{ xs:12}}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              }
                            }
                          }
                        }}
                      />
                    </Grid>

                    {isChangingPassword && (
                      <Zoom in timeout={300}>
                        <Grid container spacing={3}>
                          <Grid sx={{ xs:12}}>
                            <TextField
                              fullWidth
                              label="Current Password"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              error={!!formErrors.currentPassword}
                              helperText={formErrors.currentPassword}
                              InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'primary.main',
                                    }
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid sx={{ xs:12,sm:6}}>
                            <TextField
                              fullWidth
                              label="New Password"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleChange}
                              error={!!formErrors.newPassword}
                              helperText={formErrors.newPassword}
                              InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'primary.main',
                                    }
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid sx={{ xs:12,sm:6}}>
                            <TextField
                              fullWidth
                              label="Confirm New Password"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              error={!!formErrors.confirmPassword}
                              helperText={formErrors.confirmPassword}
                              InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'primary.main',
                                    }
                                  }
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Zoom>
                    )}

                    <Grid sx={{ xs:12}}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <Box>
                          {!isEditing ? (
                            <Button
                              startIcon={<Edit />}
                              onClick={() => setIsEditing(true)}
                              variant="contained"
                              color="primary"
                            >
                              Edit Profile
                            </Button>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<Save />}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<Cancel />}
                                onClick={handleCancel}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                            </Box>
                          )}
                        </Box>
                        {isEditing && (
                          <Button
                            color="primary"
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            disabled={isSubmitting}
                          >
                            {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
} 