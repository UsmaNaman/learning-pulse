import React, { useState } from 'react';
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
  IconButton,
  Button
} from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ResourceFeedback, { ResourceRating } from './ResourceFeedback';
import analyticsService from '../services/analyticsService';

/**
 * Component to display learning resources for a specific topic
 * 
 * @param {Object[]} resources - Array of resource objects with type, title, and url
 * @param {String} topicName - The name of the topic these resources belong to
 * @param {Boolean} expanded - Whether the resources list should be expanded by default
 */
const TopicResources = ({ resources = [], topicName = "Topic Resources", expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceRatings, setResourceRatings] = useState({});

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

  const handleResourceClick = (resource) => {
    // Track resource access
    analyticsService.trackResourceAccess(
      resource.url || resource.id,
      resource.type,
      topicName.toLowerCase().replace(/\s+/g, '_')
    );
  };

  const handleFeedbackClick = (resource, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedResource(resource);
    setFeedbackOpen(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    // In a real app, this would send to the backend
    console.log('Feedback submitted:', feedbackData);
    
    // Update local rating (demo)
    const resourceId = feedbackData.resourceId;
    setResourceRatings(prev => ({
      ...prev,
      [resourceId]: {
        averageRating: feedbackData.rating,
        totalRatings: (prev[resourceId]?.totalRatings || 0) + 1
      }
    }));
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
          {resources.map((resource, index) => {
            const resourceId = resource.url || resource.id || index;
            const rating = resourceRatings[resourceId];
            
            return (
              <ListItem 
                key={index}
                sx={{ 
                  display: 'block',
                  borderRadius: 1,
                  mb: 1,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon>
                    {getResourceIcon(resource.type)}
                  </ListItemIcon>
                  
                  <ListItemText 
                    primary={
                      <Link
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleResourceClick(resource)}
                        sx={{ 
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {resource.title}
                      </Link>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={resource.type}
                          color={getChipColor(resource.type)}
                          size="small"
                          variant="outlined"
                        />
                        {rating && (
                          <ResourceRating 
                            averageRating={rating.averageRating}
                            totalRatings={rating.totalRatings}
                            size="small"
                          />
                        )}
                      </Box>
                    }
                  />
                  
                  <Button
                    size="small"
                    startIcon={<FeedbackIcon />}
                    onClick={(event) => handleFeedbackClick(resource, event)}
                    sx={{ ml: 1 }}
                  >
                    Rate
                  </Button>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
      
      {/* Feedback Dialog */}
      {selectedResource && (
        <ResourceFeedback
          resource={selectedResource}
          topicId={topicName.toLowerCase().replace(/\s+/g, '_')}
          isOpen={feedbackOpen}
          onClose={() => {
            setFeedbackOpen(false);
            setSelectedResource(null);
          }}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </Paper>
  );
};

export default TopicResources;