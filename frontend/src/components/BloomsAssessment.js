import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Bloom's taxonomy utility inline
const getBloomsInfo = (level) => {
  const levels = {
    1: { name: 'Remember', color: '#f44336', description: 'Recall facts and basic concepts' },
    2: { name: 'Understand', color: '#ff9800', description: 'Explain ideas or concepts' },
    3: { name: 'Apply', color: '#2196f3', description: 'Use information in new situations' },
    4: { name: 'Analyze', color: '#4caf50', description: 'Draw connections and organize information' },
    5: { name: 'Evaluate', color: '#9c27b0', description: 'Justify decisions and critique work' }
  };
  return levels[level] || levels[1];
};

const BloomsAssessment = ({ 
  questions = [], 
  title = "Assessment",
  onComplete = () => {},
  studentBloomsLevel = 1 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);

  if (!questions.length) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>No questions available for this assessment.</Typography>
      </Paper>
    );
  }

  const question = questions[currentQuestion];
  const bloomsInfo = getBloomsInfo(question.bloomsLevel);
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Determine scaffolding based on student's current level vs question level
  const needsScaffolding = question.bloomsLevel > studentBloomsLevel;
  const scaffoldingLevel = needsScaffolding ? 
    (question.bloomsLevel - studentBloomsLevel > 1 ? 'high' : 'medium') : 'low';

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
    setShowFeedback(false);
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleCompleteAssessment();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const handleUseHint = () => {
    setHintsUsed({
      ...hintsUsed,
      [currentQuestion]: (hintsUsed[currentQuestion] || 0) + 1
    });
    setShowHint(true);
  };

  const handleCompleteAssessment = () => {
    // Calculate results with Bloom's-aware scoring
    let totalScore = 0;
    let bloomsLevelScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let bloomsLevelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;

      if (q.questionType === 'multiple-choice') {
        const selectedOption = q.options[parseInt(userAnswer)];
        isCorrect = selectedOption?.isCorrect || false;
      } else {
        isCorrect = userAnswer?.toLowerCase() === q.correctAnswer?.toLowerCase();
      }

      if (isCorrect) {
        // Reduce points if hints were used
        const hintsUsedForQ = hintsUsed[index] || 0;
        const scoreReduction = hintsUsedForQ * 0.2; // 20% reduction per hint
        const questionScore = Math.max(0, q.points - (q.points * scoreReduction));
        
        totalScore += questionScore;
        bloomsLevelScores[q.bloomsLevel] += questionScore;
      }
      bloomsLevelCounts[q.bloomsLevel]++;
    });

    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (totalScore / maxScore) * 100;

    const assessmentResults = {
      totalScore,
      maxScore,
      percentage,
      bloomsLevelScores,
      bloomsLevelCounts,
      hintsUsed: Object.values(hintsUsed).reduce((sum, count) => sum + count, 0),
      newBloomsLevel: getBloomsInfo(Math.min(5, Math.ceil(percentage / 20)))
    };

    setResults(assessmentResults);
    setIsComplete(true);
    onComplete(assessmentResults);
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const isCorrect = showFeedback && (() => {
    const userAnswer = answers[currentQuestion];
    if (question.questionType === 'multiple-choice') {
      const selectedOption = question.options[parseInt(userAnswer)];
      return selectedOption?.isCorrect || false;
    }
    return userAnswer?.toLowerCase() === question.correctAnswer?.toLowerCase();
  })();

  if (isComplete && results) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Assessment Complete!</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Score: {results.totalScore.toFixed(1)}/{results.maxScore} ({results.percentage.toFixed(1)}%)
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`New Bloom's Level: ${results.newBloomsLevel.name}`}
              sx={{ 
                backgroundColor: results.newBloomsLevel.color,
                color: 'white',
                mr: 2
              }}
            />
            {results.hintsUsed > 0 && (
              <Chip 
                label={`${results.hintsUsed} hints used`}
                color="info"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>Performance by Bloom's Level:</Typography>
        {Object.entries(results.bloomsLevelScores).map(([level, score]) => {
          const count = results.bloomsLevelCounts[level];
          if (count === 0) return null;
          
          const levelInfo = getBloomsInfo(parseInt(level));
          const average = score / count;
          
          return (
            <Box key={level} sx={{ mb: 1 }}>
              <Typography variant="body2">
                {levelInfo.name}: {score.toFixed(1)} points (avg: {average.toFixed(1)})
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(average / questions[0]?.points || 1) * 100}
                sx={{ 
                  height: 6,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: levelInfo.color
                  }
                }}
              />
            </Box>
          );
        })}

        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Return to Dashboard
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Chip 
            label={bloomsInfo.name}
            size="small"
            sx={{ 
              backgroundColor: bloomsInfo.color,
              color: 'white'
            }}
          />
          {needsScaffolding && (
            <Chip 
              label={`Scaffolding: ${scaffoldingLevel}`}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {question.questionText}
          </Typography>
          
          {question.bloomsKeywords && question.bloomsKeywords.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Keywords: {question.bloomsKeywords.join(', ')}
              </Typography>
            </Box>
          )}

          {question.questionType === 'multiple-choice' && (
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          )}

          {(question.questionType === 'short-answer' || question.questionType === 'coding') && (
            <TextField
              fullWidth
              multiline={question.questionType === 'coding'}
              rows={question.questionType === 'coding' ? 6 : 3}
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={question.questionType === 'coding' ? 'Enter your code here...' : 'Enter your answer...'}
              variant="outlined"
            />
          )}

          {showFeedback && (
            <Alert 
              severity={isCorrect ? 'success' : 'error'}
              icon={isCorrect ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ mt: 2 }}
            >
              <Typography variant="subtitle2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Typography>
              <Typography variant="body2">
                {isCorrect ? question.feedback?.correct : question.feedback?.incorrect}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {needsScaffolding && question.feedback?.hint && !showHint && (
            <Button
              variant="outlined"
              startIcon={<HelpOutlineIcon />}
              onClick={handleUseHint}
              color="info"
            >
              Get Hint ({(hintsUsed[currentQuestion] || 0) + 1})
            </Button>
          )}
        </Box>

        <Box>
          {!showFeedback && isAnswered && (
            <Button 
              variant="contained" 
              onClick={handleSubmitAnswer}
              sx={{ mr: 1 }}
            >
              Submit Answer
            </Button>
          )}
          
          {showFeedback && (
            <Button 
              variant="contained" 
              onClick={handleNextQuestion}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Hint Dialog */}
      <Dialog open={showHint} onClose={() => setShowHint(false)}>
        <DialogTitle>Hint</DialogTitle>
        <DialogContent>
          <Typography>{question.feedback?.hint}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHint(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BloomsAssessment;