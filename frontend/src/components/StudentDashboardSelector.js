import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import StudentAvatar from './StudentAvatar';

/**
 * StudentDashboardSelector component for switching between student dashboards
 */
const StudentDashboardSelector = () => {
  const navigate = useNavigate();
  
  // List of available students from our mock data
  const students = [
    { id: 'john', name: 'John Smith' },
    { id: 'ava', name: 'Ava Johnson' },
    { id: 'david', name: 'David Chen' },
    { id: 'fatima', name: 'Fatima Ahmed' },
    { id: 'liam', name: 'Liam Wilson' }
  ];

  const handleStudentChange = (event) => {
    const studentId = event.target.value;
    navigate(`/dashboard?student=${studentId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        component={RouterLink}
        to="/dashboard"
        startIcon={<KeyboardBackspaceIcon />}
        sx={{ mb: 2 }}
        variant="text"
      >
        Back to Dashboard
      </Button>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SchoolIcon sx={{ mr: 1.5 }} color="primary" />
        Student Dashboard Selector
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            Select a student below to view their personalized dashboard:
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="student-select-label">View Student Dashboard</InputLabel>
            <Select
              labelId="student-select-label"
              id="student-select"
              label="View Student Dashboard"
              onChange={handleStudentChange}
              defaultValue=""
            >
              {students.map(student => (
                <MenuItem key={student.id} value={student.id} sx={{ display: 'flex', alignItems: 'center' }}>
                  <StudentAvatar studentId={student.id} name={student.name} sx={{ width: 24, height: 24, mr: 1.5 }} />
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        {students.map(student => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                },
                borderTop: `4px solid`,
                borderColor: student.id === 'john' ? '#3f51b5' : 
                             student.id === 'ava' ? '#9c27b0' :
                             student.id === 'david' ? '#2196f3' :
                             student.id === 'fatima' ? '#e91e63' : '#009688'
              }}
              onClick={() => navigate(`/dashboard?student=${student.id}`)}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <StudentAvatar studentId={student.id} name={student.name} sx={{ width: 64, height: 64, mb: 2 }} />
                <Typography variant="h6" gutterBottom align="center">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Click to view dashboard
                </Typography>
                
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard?student=${student.id}`);
                  }}
                  sx={{ mt: 1 }}
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentDashboardSelector;