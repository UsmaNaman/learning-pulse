import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * Component to display a summary of student progress
 * 
 * @param {Number} overallProgress - Overall student progress percentage
 * @param {String[]} strengths - Array of student's strengths
 * @param {String[]} weaknesses - Array of areas for improvement
 * @param {String} studentName - Name of the student
 */
const ProgressSummaryCard = ({ 
  overallProgress = 0, 
  strengths = [], 
  weaknesses = [], 
  studentName = "Student" 
}) => {
  // Helper to get color based on progress level
  const getProgressColor = (progress) => {
    if (progress >= 70) return '#4caf50'; // Green
    if (progress >= 30) return '#ff9800'; // Amber
    return '#f44336'; // Red
  };

  // Get the color for overall progress
  const progressColor = getProgressColor(overallProgress);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Progress Summary</Typography>
      
      {/* Progress circle and student name */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
          <CircularProgress
            variant="determinate"
            value={overallProgress}
            size={80}
            thickness={5}
            sx={{ 
              color: progressColor,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              color="text.secondary"
            >
              {`${Math.round(overallProgress)}%`}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Overall progress for
          </Typography>
          <Typography variant="h6">{studentName}</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Strengths section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Strengths
        </Typography>
        <List dense disablePadding>
          {strengths.length > 0 ? (
            strengths.map((strength, index) => (
              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <TrendingUpIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={strength} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              No strengths identified yet
            </Typography>
          )}
        </List>
      </Box>
      
      {/* Areas for improvement */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Areas for Improvement
        </Typography>
        <List dense disablePadding>
          {weaknesses.length > 0 ? (
            weaknesses.map((weakness, index) => (
              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <TrendingDownIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={weakness} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              No areas for improvement identified
            </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default ProgressSummaryCard;