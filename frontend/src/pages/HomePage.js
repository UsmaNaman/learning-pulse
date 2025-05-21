import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';

const HomePage = () => {
  // Sample featured courses
  const featuredCourses = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      description: 'Learn the fundamentals of machine learning algorithms and applications.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Web Development',
      description: 'Master modern web technologies including React, Node.js, and GraphQL.',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      description: 'Explore data analysis, visualization, and statistical methods.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner'
    }
  ];

  return (
    <Container maxWidth="lg">
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
            Accelerate your learning journey with personalized courses and real-time performance analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              component={Link} 
              to="/courses" 
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
              Explore Courses
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

      {/* Featured Courses Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Featured Courses
        </Typography>
        <Grid container spacing={4}>
          {featuredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
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
                  image={course.image}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="primary" fontWeight="bold">
                      {course.level}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Button 
                    component={Link} 
                    to={`/courses/${course.id}`}
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ 
                      mt: 'auto',
                      borderRadius: '8px'
                    }}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={Link} 
            to="/courses" 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderRadius: '30px', 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            View All Courses
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
              <Box sx={{ 
                height: 80, 
                width: 80, 
                backgroundColor: 'rgba(74, 0, 224, 0.1)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <span style={{ fontSize: '2rem' }}>📊</span>
              </Box>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Real-time Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your progress with detailed analytics and personalized insights to optimize your learning journey.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                height: 80, 
                width: 80, 
                backgroundColor: 'rgba(74, 0, 224, 0.1)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <span style={{ fontSize: '2rem' }}>👨‍🏫</span>
              </Box>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Expert Instructors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn from industry experts with years of practical experience and proven teaching methodologies.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                height: 80, 
                width: 80, 
                backgroundColor: 'rgba(74, 0, 224, 0.1)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <span style={{ fontSize: '2rem' }}>🔄</span>
              </Box>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Adaptive Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our platform adapts to your learning pace and style, providing customized recommendations and challenges.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Student Success Stories
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "Learning Pulse transformed my career path. The data science course helped me land my dream job!"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Sarah Johnson, Data Analyst
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "The progress tracking feature motivated me to complete courses I would have otherwise abandoned."
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Michael Chen, Software Developer
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="p" gutterBottom>
                  "As an instructor, the analytics tools help me understand where my students struggle and improve my teaching."
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  — Dr. Emily Rodriguez, Computer Science Professor
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
          Ready to accelerate your learning?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Join thousands of learners already benefiting from Learning Pulse's innovative platform.
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