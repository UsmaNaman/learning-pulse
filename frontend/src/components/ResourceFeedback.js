import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  IconButton,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import analyticsService from '../services/analyticsService';

const ResourceFeedback = ({ 
  resource,
  topicId,
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {} 
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [usefulness, setUsefulness] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      return; // Rating is required
    }

    setIsSubmitting(true);

    const feedbackData = {
      resourceId: resource.id || resource.url,
      resourceType: resource.type,
      topicId: topicId,
      rating: rating,
      feedback: feedback,
      difficulty: difficulty,
      usefulness: usefulness,
      improvements: improvements,
      timestamp: new Date().toISOString()
    };

    try {
      // Track feedback submission in analytics
      await analyticsService.trackFeedbackSubmit(
        'resource_feedback',
        rating,
        resource.id || resource.url,
        topicId
      );

      // Call parent onSubmit handler
      await onSubmit(feedbackData);
      
      setSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setFeedback('');
    setDifficulty('');
    setUsefulness('');
    setImprovements('');
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300); // Reset after dialog closes
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="h6">Thank you for your feedback! 🎉</Typography>
            <Typography variant="body2">
              Your input helps us improve the learning experience for everyone.
            </Typography>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedbackIcon color="primary" />
            <Typography variant="h6">Rate This Resource</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Resource Info */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {resource.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip 
              label={resource.type}
              size="small"
              color="primary"
              variant="outlined"
            />
            {topicId && (
              <Chip 
                label={`Topic: ${topicId}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Overall Rating */}
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                How would you rate this resource overall?
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                precision={1}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {rating === 0 && "Click to rate"}
                {rating === 1 && "Poor - Not helpful"}
                {rating === 2 && "Fair - Somewhat helpful"}
                {rating === 3 && "Good - Helpful"}
                {rating === 4 && "Very Good - Very helpful"}
                {rating === 5 && "Excellent - Extremely helpful"}
              </Typography>
            </Box>
          </Grid>

          {/* Difficulty Level */}
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography variant="subtitle2">Difficulty Level</Typography>
              </FormLabel>
              <RadioGroup
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                row
              >
                <FormControlLabel
                  value="too_easy"
                  control={<Radio size="small" />}
                  label="Too Easy"
                />
                <FormControlLabel
                  value="just_right"
                  control={<Radio size="small" />}
                  label="Just Right"
                />
                <FormControlLabel
                  value="too_hard"
                  control={<Radio size="small" />}
                  label="Too Hard"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Usefulness */}
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography variant="subtitle2">How useful was this?</Typography>
              </FormLabel>
              <RadioGroup
                value={usefulness}
                onChange={(e) => setUsefulness(e.target.value)}
                row
              >
                <FormControlLabel
                  value="very_useful"
                  control={<Radio size="small" />}
                  label="Very Useful"
                />
                <FormControlLabel
                  value="somewhat_useful"
                  control={<Radio size="small" />}
                  label="Somewhat"
                />
                <FormControlLabel
                  value="not_useful"
                  control={<Radio size="small" />}
                  label="Not Useful"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Written Feedback */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What did you think of this resource?"
              placeholder="Share your thoughts, what you learned, or how it helped you..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Improvements */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="How could this resource be improved? (Optional)"
              placeholder="Suggestions for making this resource better..."
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Quick Action Buttons */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quick feedback:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant={rating >= 4 ? 'contained' : 'outlined'}
              startIcon={<ThumbUpIcon />}
              onClick={() => {
                setRating(4);
                setUsefulness('very_useful');
                setDifficulty('just_right');
              }}
              color="success"
            >
              Helpful
            </Button>
            <Button
              variant={rating <= 2 ? 'contained' : 'outlined'}
              startIcon={<ThumbDownIcon />}
              onClick={() => {
                setRating(2);
                setUsefulness('not_useful');
              }}
              color="error"
            >
              Not Helpful
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!rating || isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Star rating display component for showing average ratings
export const ResourceRating = ({ 
  averageRating = 0, 
  totalRatings = 0, 
  showCount = true,
  size = 'small' 
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating 
        value={averageRating} 
        readOnly 
        precision={0.1}
        size={size}
      />
      {showCount && (
        <Typography variant="caption" color="text.secondary">
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </Typography>
      )}
    </Box>
  );
};

export default ResourceFeedback;