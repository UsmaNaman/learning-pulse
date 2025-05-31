import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  Grid,
  Tooltip,
  Chip
} from '@mui/material';
import TopicResources from './TopicResources';
// Bloom's taxonomy utility - inline for now
const getBloomsLevel = (percentage) => {
  const BLOOMS_LEVELS = {
    1: { name: 'remember', label: 'Remember', description: 'Recall facts and basic concepts', color: '#f44336' },
    2: { name: 'understand', label: 'Understand', description: 'Explain ideas or concepts', color: '#ff9800' },
    3: { name: 'apply', label: 'Apply', description: 'Use information in new situations', color: '#2196f3' },
    4: { name: 'analyze', label: 'Analyze', description: 'Draw connections and organize information', color: '#4caf50' },
    5: { name: 'evaluate', label: 'Evaluate', description: 'Justify decisions and critique work', color: '#9c27b0' }
  };
  
  if (percentage >= 85) return { level: 5, ...BLOOMS_LEVELS[5] };
  if (percentage >= 70) return { level: 4, ...BLOOMS_LEVELS[4] };
  if (percentage >= 55) return { level: 3, ...BLOOMS_LEVELS[3] };
  if (percentage >= 40) return { level: 2, ...BLOOMS_LEVELS[2] };
  return { level: 1, ...BLOOMS_LEVELS[1] };
};

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
    security: "Network Security",
    programming: "Programming Concepts",
    algo: "Algorithms",
    ethics: "Ethical, Legal, Cultural Issues"
  };

  // Get color and Bloom's level based on mastery
  const getBloomsInfo = (mastery) => {
    return getBloomsLevel(mastery);
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
          const bloomsInfo = getBloomsInfo(skill.mastery);
          
          return (
            <Grid item xs={12} key={skill.id}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{friendlyName}</Typography>
                  <Chip 
                    label={bloomsInfo.label}
                    size="small"
                    sx={{ 
                      backgroundColor: bloomsInfo.color,
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {skill.mastery}%
                </Typography>
              </Box>
              
              <Tooltip title={`${bloomsInfo.label}: ${bloomsInfo.description} (${skill.mastery}% mastery)`}>
                <LinearProgress
                  variant="determinate"
                  value={skill.mastery}
                  role="progressbar"
                  aria-label={`${friendlyName} progress`}
                  aria-describedby={`progress-desc-${skill.id}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.mastery}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: bloomsInfo.color
                    }
                  }}
                />
              </Tooltip>
              
              {/* Screen reader description */}
              <Typography 
                id={`progress-desc-${skill.id}`}
                variant="body2" 
                sx={{ 
                  position: 'absolute',
                  left: '-10000px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden'
                }}
              >
                {`${friendlyName}: ${skill.mastery}% mastery at ${bloomsInfo.label} level. ${bloomsInfo.description}`}
              </Typography>
              
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