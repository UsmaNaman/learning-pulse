import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Chip, 
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { courseService } from '../services';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search term and level filter
    const results = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
      
      return matchesSearch && matchesLevel;
    });
    
    setFilteredCourses(results);
  }, [searchTerm, filterLevel, courses]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLevelChange = (e) => {
    setFilterLevel(e.target.value);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading courses...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Explore Courses
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Discover our wide range of courses designed to help you master new skills and advance your career.
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          label="Search courses"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="level-select-label">Level</InputLabel>
          <Select
            labelId="level-select-label"
            value={filterLevel}
            label="Level"
            onChange={handleLevelChange}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            No courses match your search criteria.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
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
                  image={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip 
                      label={course.level} 
                      size="small" 
                      color={
                        course.level === 'Beginner' ? 'success' : 
                        course.level === 'Intermediate' ? 'primary' : 
                        'secondary'
                      }
                      sx={{ borderRadius: '4px' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {course.duration}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    <strong>Instructor:</strong> {course.instructor}
                  </Typography>
                  {course.topics && course.topics.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {course.topics.slice(0, 3).map((topic, index) => (
                        <Chip 
                          key={index} 
                          label={topic} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: '4px' }}
                        />
                      ))}
                      {course.topics.length > 3 && (
                        <Chip 
                          label={`+${course.topics.length - 3}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: '4px' }}
                        />
                      )}
                    </Box>
                  )}
                  <Button 
                    component={Link} 
                    to={`/courses/${course._id}`}
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
      )}
    </Container>
  );
};

export default Courses;