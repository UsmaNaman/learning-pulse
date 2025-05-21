import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  Box,
  Collapse,
  Button
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TopicResources from './TopicResources';

/**
 * Component to display a student's recent activity
 * 
 * @param {Object[]} activities - Array of activity objects
 */
const RecentActivityList = ({ activities = [] }) => {
  // State to track which activities are expanded to show resources
  const [expandedActivity, setExpandedActivity] = React.useState(null);
  
  // Toggle expanded state for an activity
  const toggleExpanded = (index) => {
    setExpandedActivity(expandedActivity === index ? null : index);
  };
  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  // Get icon by activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'assessment':
        return <QuizIcon color="primary" />;
      case 'activity':
      default:
        return <AssignmentIcon color="secondary" />;
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 70) return '#4caf50'; // Green
    if (score >= 50) return '#ff9800'; // Amber
    return '#f44336'; // Red
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      
      {activities.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
          No recent activity to display
        </Typography>
      ) : (
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem 
                divider={index < activities.length - 1 && !activity.resources?.length}
                sx={{ px: 1 }}
              >
                <ListItemIcon>
                  {getActivityIcon(activity.type)}
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={formatDate(activity.completedAt)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${activity.score}%`}
                    size="small"
                    sx={{ 
                      backgroundColor: getScoreColor(activity.score),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  
                  {activity.resources && activity.resources.length > 0 && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => toggleExpanded(index)}
                      endIcon={expandedActivity === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    >
                      Resources
                    </Button>
                  )}
                </Box>
              </ListItem>
              
              {/* Resources collapse panel */}
              {activity.resources && activity.resources.length > 0 && (
                <Collapse 
                  in={expandedActivity === index} 
                  timeout="auto" 
                  unmountOnExit
                  sx={{ pl: 9, pr: 2, pb: index < activities.length - 1 ? 2 : 0 }}
                >
                  <Box sx={{ mb: index < activities.length - 1 ? 0 : 0 }}>
                    <TopicResources 
                      resources={activity.resources}
                      topicName={activity.topicName || 'Activity'}
                      expanded={true}
                    />
                  </Box>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecentActivityList;