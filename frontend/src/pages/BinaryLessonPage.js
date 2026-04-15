import React, { useState } from 'react';
import { Container, Paper, Box, Button, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BinaryLesson from '../components/lessons/BinaryLesson';

const BLOOMS_LABELS = { 1: 'Remember', 2: 'Understand', 3: 'Apply', 4: 'Analyse', 5: 'Evaluate' };
const BLOOMS_COLOURS = { 1: '#2196f3', 2: '#9c27b0', 3: '#ff9800', 4: '#4caf50', 5: '#f44336' };

const BinaryLessonPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const handleComplete = (score, bloomsLevel) => {
    setResult({ score, bloomsLevel });
    // TODO: persist to backend — userService.updateTopicMastery('binary', score, bloomsLevel)
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Binary & Data Representation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          OCR J277 · Component 1 · Unit 1.2 — Memory and Storage
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
        }}
      >
        {result ? (
          // Completion screen
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <EmojiEventsIcon
              sx={{
                fontSize: 72, mb: 2,
                color: result.score >= 80 ? '#00e5a0' : result.score >= 60 ? '#ff9800' : '#f44336',
              }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Lesson Complete!
            </Typography>
            <Typography variant="h2" fontWeight={900} color="primary.main" sx={{ mb: 1 }}>
              {result.score}%
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
              <Chip
                label={`Bloom's: ${BLOOMS_LABELS[result.bloomsLevel]}`}
                sx={{
                  bgcolor: `${BLOOMS_COLOURS[result.bloomsLevel]}18`,
                  color: BLOOMS_COLOURS[result.bloomsLevel],
                  border: `1px solid ${BLOOMS_COLOURS[result.bloomsLevel]}44`,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={result.score >= 80 ? 'Mastery achieved' : result.score >= 60 ? 'Good progress' : 'Keep practising'}
                color={result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error'}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => setResult(null)}>
                Retry Lesson
              </Button>
              <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        ) : (
          <BinaryLesson onComplete={handleComplete} />
        )}
      </Paper>
    </Container>
  );
};

export default BinaryLessonPage;
