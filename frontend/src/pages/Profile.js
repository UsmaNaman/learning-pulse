import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Avatar, 
  Button, 
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';

const Profile = () => {
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    notifications: true,
    language: 'English'
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // In a real app, this would save to the backend
      // await userService.updateProfile(formData);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Profile Picture and Role */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </Avatar>
            
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              {currentUser?.name}
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mt: 1, 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText',
                py: 0.5,
                px: 2,
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              {currentUser?.role === 'student' ? 'Student' : 
               currentUser?.role === 'instructor' || currentUser?.role === 'teacher' ? 'Instructor' : 
               currentUser?.role || 'User'}
            </Typography>
            
            {!editing && (
              <Button 
                variant="outlined" 
                sx={{ mt: 3 }}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
          
          {/* Right Column - Profile Information */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 1 }}>
              {editing ? 'Edit Profile' : 'Profile Information'}
            </Typography>
            
            {editing ? (
              // Edit Mode
              <Box component="form">
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  disabled  // Usually email shouldn't be easily changeable
                />
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  Preferences
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        Notifications:
                      </Typography>
                      <Button 
                        variant={formData.notifications ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          notifications: true
                        }))}
                        sx={{ mr: 1 }}
                      >
                        On
                      </Button>
                      <Button 
                        variant={!formData.notifications ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          notifications: false
                        }))}
                      >
                        Off
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        Language:
                      </Typography>
                      <TextField
                        select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        size="small"
                        sx={{ minWidth: 120 }}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: currentUser?.name || '',
                        email: currentUser?.email || '',
                        notifications: true,
                        language: 'English'
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              // View Mode
              <Box>
                <Grid container spacing={2}>
                  {/* Basic Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Basic Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {currentUser?.name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {currentUser?.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Role
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {currentUser?.role === 'student' ? 'Student' : 
                       currentUser?.role === 'instructor' || currentUser?.role === 'teacher' ? 'Instructor' : 
                       currentUser?.role || 'User'}
                    </Typography>
                  </Grid>
                  
                  {/* Account Information Section */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Account Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      User ID
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {currentUser?._id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Account Status
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <span style={{ 
                        width: 8, 
                        height: 8, 
                        backgroundColor: '#4caf50', 
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span>
                      Active
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Last Login
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Typography>
                  </Grid>
                  
                  {/* Preferences Section */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Preferences
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Notifications
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      Enabled
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Language
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      English
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Role-specific information sections */}
      {currentUser?.role === 'student' && (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 1 }}>
            Student Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Learning Progress
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Overall progress: 68%
                </Typography>
                <Typography variant="body2">
                  Activities completed: 24
                </Typography>
                <Typography variant="body2">
                  Current streak: 3 days
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Skills
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Strongest: Programming Concepts
                </Typography>
                <Typography variant="body2">
                  Needs work: Cyber Security
                </Typography>
                <Button variant="text" color="primary" size="small" sx={{ mt: 1 }}>
                  View Detailed Progress
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {(currentUser?.role === 'instructor' || currentUser?.role === 'teacher') && (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 1 }}>
            Instructor Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Teaching Statistics
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Courses created: 3
                </Typography>
                <Typography variant="body2">
                  Students enrolled: 42
                </Typography>
                <Typography variant="body2">
                  Average student progress: 57%
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Recent Activity
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Last course update: 2 days ago
                </Typography>
                <Typography variant="body2">
                  Student interactions this week: 18
                </Typography>
                <Button variant="text" color="primary" size="small" sx={{ mt: 1 }}>
                  View Teaching Dashboard
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          elevation={6} 
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;