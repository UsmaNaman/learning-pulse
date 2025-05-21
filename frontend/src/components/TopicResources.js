import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Link, 
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * Component to display learning resources for a specific topic
 * 
 * @param {Object[]} resources - Array of resource objects with type, title, and url
 * @param {String} topicName - The name of the topic these resources belong to
 * @param {Boolean} expanded - Whether the resources list should be expanded by default
 */
const TopicResources = ({ resources = [], topicName = "Topic Resources", expanded = false }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <VideoLibraryIcon color="primary" />;
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'worksheet':
        return <AssignmentIcon color="success" />;
      case 'link':
      default:
        return <LinkIcon color="info" />;
    }
  };

  // Get chip color based on resource type
  const getChipColor = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'primary';
      case 'pdf':
        return 'error';
      case 'worksheet':
        return 'success';
      case 'link':
      default:
        return 'info';
    }
  };

  // If no resources, show empty state
  if (!resources.length) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <LinkIcon sx={{ mr: 1 }} /> 
          {topicName} Resources
        </Typography>
        <IconButton 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="toggle resources"
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <List dense>
          {resources.map((resource, index) => (
            <ListItem 
              key={index}
              component={Link}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                textDecoration: 'none', 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon>
                {getResourceIcon(resource.type)}
              </ListItemIcon>
              <ListItemText 
                primary={resource.title}
                secondary={
                  <Chip 
                    label={resource.type}
                    color={getChipColor(resource.type)}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default TopicResources;