import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  Grid,
  Tooltip
} from '@mui/material';
import TopicResources from './TopicResources';

/**
 * Component to display a student's skill progress across different topics
 * 
 * @param {Object[]} skills - Array of skill objects with id and mastery props
 * @param {String} title - Optional title for the component
 */
const StudentSkillProgress = ({ skills = [], title = "Topic Progress" }) => {
  // Map skill IDs to friendly names
  const skillNames = {
    sys_arch: "Systems Architecture",
    mem_storage: "Memory and Storage",
    networks: "Computer Networks",
    security: "Cyber Security",
    programming: "Programming Concepts",
    algo: "Algorithms",
    ethics: "Ethical, Legal, Cultural Issues"
  };

  // Get color based on mastery level
  const getMasteryColor = (mastery) => {
    if (mastery >= 70) return '#4caf50'; // Green
    if (mastery >= 30) return '#ff9800'; // Amber
    return '#f44336'; // Red
  };

  // If no skills, show empty state
  if (!skills.length) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ py: 2 }}>
          <Typography color="textSecondary">No skills data available</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
      <Grid container spacing={2}>
        {skills.map(skill => {
          const friendlyName = skill.name || skillNames[skill.id] || skill.id;
          const masteryColor = getMasteryColor(skill.mastery);
          
          return (
            <Grid item xs={12} key={skill.id}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{friendlyName}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {skill.mastery}%
                </Typography>
              </Box>
              
              <Tooltip title={`${skill.mastery}% mastery in ${friendlyName}`}>
                <LinearProgress
                  variant="determinate"
                  value={skill.mastery}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: masteryColor
                    }
                  }}
                />
              </Tooltip>
              
              {/* Display resources for this topic if available */}
              {skill.resources && skill.resources.length > 0 && (
                <TopicResources 
                  resources={skill.resources} 
                  topicName={friendlyName}
                  expanded={skill.mastery < 60} // Auto-expand for low mastery topics
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default StudentSkillProgress;