import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Avatar, 
  Grid,
  Link,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      console.log("Form Login - Starting login with:", credentials);
      const user = await login(credentials);
      console.log("Form Login - Login successful, user:", user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Form Login - Error during login:", err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo login credentials for easy testing
  const handleDemoLogin = async (role) => {
    console.log(`Demo Login Button Clicked - Role: ${role}`);
    setIsSubmitting(true);
    setError('');
    
    // Set credentials based on role
    const demoCredentials = {
      email: role === 'john' ? 'john.s@school.edu' : 
             role === 'emily' ? 'emily.j@school.edu' :
             'jane@school.edu',
      password: 'demo123'
    };
    
    console.log(`Demo Login - ${role} - Starting login with:`, demoCredentials);
    
    try {
      // Log in directly without form submission
      const user = await login(demoCredentials);
      console.log(`Demo Login - ${role} - Login successful, user:`, user);
      
      // Use React Router navigation instead of window.location
      navigate('/dashboard');
    } catch (err) {
      console.error(`Demo Login - ${role} - Error during login:`, err);
      setError('Failed to login with demo account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          mb: 4, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: '12px'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          🔒
        </Avatar>
        <Typography component="h1" variant="h5" fontWeight="bold">
          Sign In
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
                Quick login with demo accounts:
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button 
                fullWidth 
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleDemoLogin('john')}
                disabled={isSubmitting}
              >
                John Smith
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button 
                fullWidth 
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleDemoLogin('emily')}
                disabled={isSubmitting}
              >
                Emily Jones
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button 
                fullWidth 
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleDemoLogin('instructor')}
                disabled={isSubmitting}
              >
                Instructor
              </Button>
            </Grid>
          </Grid>
          
          {/* Stacked links with vertical spacing */}
          <Stack spacing={1.5} sx={{ mt: 3, pt: 2, borderTop: '1px solid #eaeaea', alignItems: 'center' }}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;