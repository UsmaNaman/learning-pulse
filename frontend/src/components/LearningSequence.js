import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating
} from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import ReflectIcon from '@mui/icons-material/Psychology';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LearningSequence = ({ 
  topic,
  sequence = [],
  onComplete = () => {},
  onReflectionSubmit = () => {}
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState({});
  const [stepRatings, setStepRatings] = useState({});

  const defaultSequence = [
    {
      id: 'video',
      type: 'video',
      title: 'Watch Introduction Video',
      description: 'Start with the foundation video to understand key concepts',
      resource: topic?.resources?.find(r => r.type === 'video'),
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'worksheet',
      type: 'worksheet',
      title: 'Complete Practice Worksheet',
      description: 'Apply what you learned with guided practice exercises',
      resource: topic?.resources?.find(r => r.type === 'worksheet'),
      estimatedTime: '20-25 minutes'
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Take Knowledge Check Quiz',
      description: 'Test your understanding with interactive questions',
      resource: { type: 'quiz', title: `${topic?.name} Quiz`, url: '#quiz' },
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'coding',
      type: 'coding',
      title: 'Coding Challenge',
      description: 'Put your skills into practice with a real coding task',
      resource: { type: 'coding', title: `${topic?.name} Coding Task`, url: '#coding' },
      estimatedTime: '15-30 minutes'
    },
    {
      id: 'reflection',
      type: 'reflection',
      title: 'Reflect on Learning',
      description: 'Think about what you learned and how you can apply it',
      estimatedTime: '5-10 minutes'
    }
  ];

  const steps = sequence.length > 0 ? sequence : defaultSequence;
  const currentStep = steps[activeStep];

  const getStepIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibraryIcon />;
      case 'worksheet': return <AssignmentIcon />;
      case 'quiz': return <QuizIcon />;
      case 'coding': return <CodeIcon />;
      case 'reflection': return <ReflectIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const getStepColor = (type) => {
    switch (type) {
      case 'video': return '#2196f3';
      case 'worksheet': return '#4caf50';
      case 'quiz': return '#ff9800';
      case 'coding': return '#9c27b0';
      case 'reflection': return '#607d8b';
      default: return '#757575';
    }
  };

  const handleStepComplete = () => {
    if (currentStep.type === 'reflection') {
      setReflectionOpen(true);
    } else {
      markStepComplete();
    }
  };

  const markStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(activeStep);
    setCompletedSteps(newCompleted);

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // All steps completed
      onComplete({
        topic: topic?.name,
        stepsCompleted: steps.length,
        reflectionAnswers,
        stepRatings,
        completedAt: new Date()
      });
    }
  };

  const handleReflectionSubmit = () => {
    onReflectionSubmit(reflectionAnswers);
    setReflectionOpen(false);
    markStepComplete();
  };

  const reflectionPrompts = [
    {
      id: 'understanding',
      question: 'What was the most important concept you learned in this topic?',
      type: 'text'
    },
    {
      id: 'difficulty',
      question: 'What did you find most challenging and how did you overcome it?',
      type: 'text'
    },
    {
      id: 'application',
      question: 'How can you apply what you learned to real-world situations?',
      type: 'text'
    },
    {
      id: 'confidence',
      question: 'How confident do you feel about this topic now?',
      type: 'rating'
    },
    {
      id: 'next_steps',
      question: 'What would you like to learn next related to this topic?',
      type: 'text'
    }
  ];

  const isStepCompleted = (stepIndex) => completedSteps.has(stepIndex);
  const isStepActive = (stepIndex) => stepIndex === activeStep;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Learning Sequence: {topic?.name || 'Topic'}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Follow this structured learning path for optimal understanding. Complete each step before moving to the next.
      </Alert>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id} completed={isStepCompleted(index)}>
            <StepLabel
              optional={
                <Typography variant="caption">
                  {step.estimatedTime}
                </Typography>
              }
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isStepCompleted(index) 
                      ? '#4caf50' 
                      : isStepActive(index) 
                        ? getStepColor(step.type)
                        : '#e0e0e0',
                    color: 'white'
                  }}
                >
                  {isStepCompleted(index) ? (
                    <CheckCircleIcon />
                  ) : (
                    getStepIcon(step.type)
                  )}
                </Box>
              )}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{step.title}</Typography>
                <Chip 
                  label={step.type}
                  size="small"
                  sx={{ 
                    backgroundColor: getStepColor(step.type),
                    color: 'white'
                  }}
                />
              </Box>
            </StepLabel>
            
            <StepContent>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1" paragraph>
                    {step.description}
                  </Typography>
                  
                  {step.resource && step.type !== 'reflection' && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        href={step.resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={getStepIcon(step.type)}
                        sx={{ mr: 2 }}
                      >
                        {step.resource.title || step.title}
                      </Button>
                    </Box>
                  )}

                  {step.type === 'reflection' && (
                    <Typography variant="body2" color="text.secondary">
                      Click "Complete Step" to open the reflection questionnaire.
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleStepComplete}
                      disabled={isStepCompleted(index)}
                    >
                      {isStepCompleted(index) ? 'Completed' : 'Complete Step'}
                    </Button>
                    
                    {isStepCompleted(index) && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Rate this step:
                        </Typography>
                        <Rating
                          value={stepRatings[index] || 0}
                          onChange={(event, newValue) => {
                            setStepRatings({
                              ...stepRatings,
                              [index]: newValue
                            });
                          }}
                          size="small"
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Reflection Dialog */}
      <Dialog 
        open={reflectionOpen} 
        onClose={() => setReflectionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReflectIcon />
            Learning Reflection
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Take a moment to reflect on your learning experience. This helps consolidate your understanding and plan next steps.
          </Typography>
          
          {reflectionPrompts.map((prompt, index) => (
            <Box key={prompt.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {index + 1}. {prompt.question}
              </Typography>
              
              {prompt.type === 'text' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={reflectionAnswers[prompt.id] || ''}
                  onChange={(e) => setReflectionAnswers({
                    ...reflectionAnswers,
                    [prompt.id]: e.target.value
                  })}
                  placeholder="Enter your thoughts..."
                />
              ) : (
                <Rating
                  value={reflectionAnswers[prompt.id] || 0}
                  onChange={(event, newValue) => {
                    setReflectionAnswers({
                      ...reflectionAnswers,
                      [prompt.id]: newValue
                    });
                  }}
                />
              )}
            </Box>
          ))}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setReflectionOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReflectionSubmit} 
            variant="contained"
            disabled={!reflectionAnswers.understanding || !reflectionAnswers.confidence}
          >
            Submit Reflection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Summary */}
      {completedSteps.size === steps.length && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6">Congratulations!</Typography>
          <Typography>
            You've completed the entire learning sequence for {topic?.name}. 
            Your reflection has been saved and your progress updated.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default LearningSequence;