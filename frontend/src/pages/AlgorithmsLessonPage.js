import React, { useState } from 'react';
import { Container, Paper, Box, Button, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../context/AuthContext';
import AlgorithmsLesson from '../components/lessons/AlgorithmsLesson';
import { progressService } from '../services';

const BLOOMS_LABELS  = { 1: 'Remember', 2: 'Understand', 3: 'Apply', 4: 'Analyse', 5: 'Evaluate' };
const BLOOMS_COLOURS = { 1: '#2196f3', 2: '#9c27b0', 3: '#ff9800', 4: '#4caf50', 5: '#f44336' };
const SAVE_MESSAGES = {
  saving: 'Saving your score…',
  saved: '✓ Saved — your teacher can see this result',
  failed: "Couldn't save your score. Check your connection and try the lesson again.",
  demo: "Demo mode — scores aren't saved",
  preview: 'Teacher preview — scores are only saved for students',
};

const AlgorithmsLessonPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleComplete = async (score, bloomsLevel) => {
    setResult({ score, bloomsLevel });
    if (currentUser?.role !== 'student') {
      setSaveStatus('preview');
      return;
    }
    setSaveStatus('saving');
    try {
      const { data } = await progressService.recordAttempt('algorithms', score, bloomsLevel);
      setSaveStatus(data?.demo ? 'demo' : 'saved');
    } catch (error) {
      console.warn('Could not save quiz attempt', error);
      setSaveStatus('failed');
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSaveStatus(null);
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
          Algorithms &amp; Flowcharts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          OCR J277 · Component 1 · Unit 2.1 — Computational Thinking
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
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <EmojiEventsIcon sx={{
              fontSize: 72, mb: 2,
              color: result.score >= 80 ? '#00e5a0' : result.score >= 60 ? '#ff9800' : '#f44336',
            }} />
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Lesson Complete!</Typography>
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
            {saveStatus && (
              <Typography
                variant="body2"
                color={saveStatus === 'failed' ? 'error' : 'text.secondary'}
                sx={{ mt: -2, mb: 3 }}
              >
                {SAVE_MESSAGES[saveStatus]}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={handleRetry}>Retry Lesson</Button>
              <Button variant="contained" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </Box>
          </Box>
        ) : (
          <AlgorithmsLesson onComplete={handleComplete} />
        )}
      </Paper>
    </Container>
  );
};

export default AlgorithmsLessonPage;
