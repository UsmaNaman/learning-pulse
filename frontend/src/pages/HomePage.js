import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Box, Card, CardContent, CardMedia, Alert } from '@mui/material';

const HomePage = () => {
  // Sample skills that can be tracked
  const trackableSkills = [
    {
      id: 1,
      title: 'Systems Architecture',
      description: 'Track progress on hardware, software, and system organization concepts.',
      image: '/images/systems.jpg',
      category: 'Computer Systems'
    },
    {
      id: 2,
      title: 'Programming Concepts',
      description: 'Monitor development in sequence, selection, iteration, and data structures.',
      image: '/images/programming.jpg',
      category: 'Development Skills'
    },
    {
      id: 3,
      title: 'Algorithms',
      description: 'Track understanding of problem-solving techniques, sorting, and searching.',
      image: '/images/algorithms.jpg',
      category: 'Computational Thinking'
    }
  ];

  const isGitHubPages = window.location.hostname === 'usmanaman.github.io';

  return (
    <Container maxWidth="lg">
      {/* Demo Banner for GitHub Pages */}
      {isGitHubPages && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 2, 
            mb: 4, 
            borderRadius: '8px',
            '& .MuiAlert-message': { 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1 
            }
          }}
        >
          <Typography variant="h6" component="div">
            🚀 Demo Mode - Try Learning Pulse!
          </Typography>
          <Typography variant="body2">
            This is a demonstration version with sample data for John Smith and Emily Jones. 
            Use the demo login buttons to explore student and instructor dashboards.
          </Typography>
        </Alert>
      )}
      
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 6,
          backgroundImage: 'linear-gradient(to right, #8e2de2, #4a00e0)',
          backgroundSize: 'cover',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            backgroundImage: 'url("https://images.unsplash.com/photo-1501290741922-b56c0d0884af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2, p: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Learning Pulse
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            KS4 Computer Science Skills Tracker for students and teachers
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              component={Link} 
              to="/dashboard" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                borderRadius: '30px', 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#4a00e0',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              View Dashboard
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="outlined" 
              size="large"
              sx={{ 
                borderRadius: '30px', 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign Up Free
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Trackable Skills Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Track Your Computer Science Skills
        </Typography>
        <Grid container spacing={4}>
          {trackableSkills.map((skill) => (
            <Grid item key={skill.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={skill.image}
                  alt={skill.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="primary" fontWeight="bold">
                      {skill.category}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                    {skill.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {skill.description}
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/dashboard"
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ 
                      mt: 'auto',
                      borderRadius: '8px'
                    }}
                  >
                    Track Progress
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={Link} 
            to="/dashboard" 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            View All Skills
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Why Choose Learning Pulse?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Card sx={{ mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image="/images/visual.jpg"
                  alt="Visual Progress Tracking"
                />
              </Card>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Visual Progress Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track curriculum-aligned skills with intuitive visualizations and identify areas requiring improvement.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Card sx={{ mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image="/images/personalized.jpg"
                  alt="Personalized Learning"
                />
              </Card>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Personalized Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive targeted recommendations based on your current mastery level for each KS4 topic.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Card sx={{ mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image="/images/teacher.jpg"
                  alt="Teacher Insights"
                />
              </Card>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Teacher Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teachers can monitor class progress, identify common struggle areas, and adjust instruction accordingly.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          User Success Stories
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '12px', height: '100%', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="180"
                image="/images/student1.jpg"
                alt="Student Success Story"
              />
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "Learning Pulse helped me identify my weak areas in Computer Science. My test scores have improved dramatically!"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Sarah Johnson, Year 9 Student
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '12px', height: '100%', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="180"
                image="/images/student2.jpg"
                alt="Student Success Story"
              />
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "The skills tracking features help me take ownership of my learning and focus on topics I really need to improve."
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Michael Chen, Year 8 Student
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '12px', height: '100%', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="180"
                image="/images/teacher-profile.jpg"
                alt="Teacher Success Story"
              />
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "As a teacher, the analytics tools help me understand where my students struggle and tailor my lessons to their needs."
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Ms. Emily Rodriguez, KS4 Computer Science Teacher
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          backgroundImage: 'linear-gradient(to right, #8e2de2, #4a00e0)',
          color: 'white',
          mb: 6
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to track your progress?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Join teachers and students already benefiting from Learning Pulse's skills tracking platform.
        </Typography>
        <Button 
          component={Link} 
          to="/register" 
          variant="contained" 
          size="large"
          sx={{ 
            borderRadius: '30px', 
            px: 4, 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'white',
            color: '#4a00e0',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)'
            }
          }}
        >
          Get Started Today
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;