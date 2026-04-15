import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, LinearProgress, Chip, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_LABELS = ['Bit Flipper', 'Sort Challenge', 'Quiz'];

const COLUMN_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

const BIT_CHALLENGES = [
  { target: 5,   hint: '5 = 4 + 1  →  only the 4-column and 1-column are ON' },
  { target: 12,  hint: '12 = 8 + 4  →  the 8-column and 4-column are ON' },
  { target: 42,  hint: '42 = 32 + 8 + 2  →  three columns ON' },
  { target: 200, hint: '200 = 128 + 64 + 8  →  three columns ON' },
];

const SORT_ITEMS_INITIAL = [
  { id: 1, binary: '00001111', decimal: 15 },
  { id: 2, binary: '00000011', decimal: 3  },
  { id: 3, binary: '00100000', decimal: 32 },
  { id: 4, binary: '00000111', decimal: 7  },
  { id: 5, binary: '00010100', decimal: 20 },
];

const QUESTIONS = [
  {
    bloomsLevel: 1, bloomsLabel: 'Remember',
    q: 'How many bits are in one byte?',
    options: ['4', '8', '16', '32'],
    correct: 1,
    explanation: 'A byte = 8 bits. This is fundamental — all memory sizes (KB, MB, GB) are built from bytes.'
  },
  {
    bloomsLevel: 1, bloomsLabel: 'Remember',
    q: 'What decimal value does the binary number 0101 represent?',
    options: ['3', '4', '5', '6'],
    correct: 2,
    explanation: '0101 → 0×8 + 1×4 + 0×2 + 1×1 = 4 + 1 = 5 ✓'
  },
  {
    bloomsLevel: 2, bloomsLabel: 'Understand',
    q: 'Why do computers use binary (base-2) rather than decimal (base-10)?',
    options: [
      'Binary numbers are shorter to write',
      'Electronic circuits reliably represent two voltage states: on (1) and off (0)',
      'Binary uses less storage space than decimal',
      'Decimal was invented after computers were built',
    ],
    correct: 1,
    explanation: 'Circuits can reliably detect two states — high voltage (1) or low voltage (0). Designing hardware to distinguish 10 different voltage levels reliably would be extremely difficult and error-prone.'
  },
  {
    bloomsLevel: 3, bloomsLabel: 'Apply',
    q: 'Convert the decimal number 13 into 4-bit binary.',
    options: ['1011', '1110', '1101', '1010'],
    correct: 2,
    explanation: '13 = 8 + 4 + 1 → bits in positions 8, 4, and 1 are ON → 1101 ✓'
  },
  {
    bloomsLevel: 4, bloomsLabel: 'Analyse',
    q: 'An 8-bit register holds 11111111. What happens when the CPU adds 1 to this value?',
    options: [
      'The value wraps around to 00000000 — this is called integer overflow',
      'The computer automatically upgrades to 16 bits to fit the result',
      'The result is stored as 11111110 (the last bit flips)',
      'The register keeps the value 11111111 — it is already the maximum',
    ],
    correct: 0,
    explanation: '11111111 = 255. Adding 1 gives 256 = 100000000, which needs 9 bits. In an 8-bit system the carry bit is lost and the value wraps to 00000000. This integer overflow is a real source of bugs in low-level programming!'
  },
];

const BLOOMS_COLOURS = {
  1: '#2196f3',
  2: '#9c27b0',
  3: '#ff9800',
  4: '#4caf50',
  5: '#f44336',
};

const bitsToDecimal = (bits) =>
  bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0);

// ─── Stage 1: Bit Flipper ─────────────────────────────────────────────────────

const BitFlipper = ({ onComplete }) => {
  const [bits, setBits] = useState(Array(8).fill(0));
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [solved, setSolved] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const decimal = bitsToDecimal(bits);
  const challenge = BIT_CHALLENGES[challengeIdx];
  const isCorrect = decimal === challenge?.target;
  const allDone = solved.length === BIT_CHALLENGES.length;

  const toggle = (i) => {
    const next = [...bits];
    next[i] = next[i] ? 0 : 1;
    setBits(next);
  };

  const confirmSolution = () => {
    const newSolved = [...solved, challengeIdx];
    setSolved(newSolved);
    if (newSolved.length < BIT_CHALLENGES.length) {
      setChallengeIdx(challengeIdx + 1);
      setBits(Array(8).fill(0));
      setShowHint(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Stage 1 — Bit Flipper
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click the squares to flip bits on (1) or off (0). Each column has a place value — they double from right to left, just like decimal places.
      </Typography>

      {/* Column weight labels */}
      <Box sx={{ display: 'flex', gap: 1, mb: 0.5, justifyContent: 'center' }}>
        {COLUMN_WEIGHTS.map((w, i) => (
          <Box key={i} sx={{ width: 48, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>{w}</Typography>
          </Box>
        ))}
      </Box>

      {/* Bit toggle buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
        {bits.map((bit, i) => (
          <Box
            key={i}
            component="button"
            onClick={() => toggle(i)}
            sx={{
              width: 48, height: 48,
              borderRadius: 2,
              border: '2px solid',
              borderColor: bit ? '#00e5a0' : 'rgba(255,255,255,0.15)',
              bgcolor: bit ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.04)',
              color: bit ? '#00e5a0' : 'rgba(255,255,255,0.25)',
              fontSize: 22, fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.12s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              '&:hover': {
                borderColor: '#00e5a0',
                bgcolor: 'rgba(0,229,160,0.1)',
                color: '#00e5a0',
              },
            }}
          >
            {bit}
          </Box>
        ))}
      </Box>

      {/* Live decimal readout */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
          Decimal value
        </Typography>
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{ color: isCorrect && challenge ? '#00e5a0' : '#f0f2f8', transition: 'color 0.2s' }}
        >
          {decimal}
        </Typography>
      </Box>

      {/* Challenge / completion panel */}
      {!allDone ? (
        <Paper sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Challenge {challengeIdx + 1} of {BIT_CHALLENGES.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {BIT_CHALLENGES.map((_, i) => (
                <Box key={i} sx={{
                  width: 8, height: 8, borderRadius: '50%',
                  bgcolor: solved.includes(i) ? '#00e5a0' : i === challengeIdx ? 'primary.main' : 'rgba(255,255,255,0.12)',
                  transition: 'background-color 0.2s',
                }} />
              ))}
            </Box>
          </Box>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Set the bits to make{' '}
            <Box component="span" sx={{ color: '#00e5a0' }}>{challenge.target}</Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              disabled={!isCorrect}
              onClick={confirmSolution}
              startIcon={isCorrect ? <CheckCircleIcon /> : null}
            >
              {isCorrect ? 'Correct! Next →' : `Target: ${challenge.target}`}
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<LightbulbOutlinedIcon />}
              onClick={() => setShowHint(!showHint)}
              sx={{ color: 'text.secondary' }}
            >
              {showHint ? 'Hide hint' : 'Hint'}
            </Button>
          </Box>

          {showHint && (
            <Alert
              severity="info"
              icon={<LightbulbOutlinedIcon />}
              sx={{ mt: 2, bgcolor: 'rgba(33,150,243,0.06)', border: '1px solid rgba(33,150,243,0.2)', color: 'text.primary' }}
            >
              {challenge.hint}
            </Alert>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.2)' }}>
          <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
            All challenges complete! 🎉
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            You've mastered converting decimal to binary. Ready for the next stage?
          </Typography>
          <Button variant="contained" onClick={onComplete}>
            Next: Sort Challenge →
          </Button>
        </Paper>
      )}
    </Box>
  );
};

// ─── Stage 2: Sort Challenge ──────────────────────────────────────────────────

const SortChallenge = ({ onComplete }) => {
  const [items, setItems] = useState([...SORT_ITEMS_INITIAL]);
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);

  const isSorted = items.every((item, i, arr) =>
    i === 0 || arr[i - 1].decimal <= item.decimal
  );

  const handleDragStart = (i) => setDragIdx(i);

  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragIdx(i);
    setChecked(false);
  };

  const handleDrop = () => setDragIdx(null);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Stage 2 — Sort Challenge
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag the binary numbers into <strong>ascending order</strong> — smallest decimal value at the top.
        Convert each to decimal first to work out the order.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        {items.map((item, i) => (
          <Box
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={handleDrop}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              p: 1.5, pl: 2, borderRadius: 2,
              bgcolor: dragIdx === i ? 'rgba(0,229,160,0.08)' : 'rgba(255,255,255,0.04)',
              border: '1px solid',
              borderColor:
                checked && isSorted ? 'rgba(0,229,160,0.35)' :
                checked && !isSorted ? 'rgba(244,67,54,0.35)' :
                dragIdx === i ? 'rgba(0,229,160,0.3)' :
                'rgba(255,255,255,0.08)',
              cursor: 'grab',
              transition: 'all 0.12s',
              userSelect: 'none',
              '&:active': { cursor: 'grabbing' },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 16, lineHeight: 1 }}>⠿</Typography>
            <Typography
              fontFamily="'Courier New', monospace"
              fontWeight={700}
              sx={{ fontSize: 18, color: 'primary.main', flex: 1, letterSpacing: 2 }}
            >
              {item.binary}
            </Typography>
            {checked && (
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                = {item.decimal}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {checked && !isSorted && (
        <Alert
          severity="error"
          sx={{ mb: 2, bgcolor: 'rgba(244,67,54,0.06)', border: '1px solid rgba(244,67,54,0.2)', color: 'text.primary' }}
        >
          Not quite — convert each binary number to decimal first to find the correct order. The decimal values are shown on the right to help you.
        </Alert>
      )}

      {checked && isSorted ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.2)' }}>
          <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
            Correct order! ✓
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            3 → 7 → 15 → 20 → 32. Converting binary to decimal lets you compare any two values.
          </Typography>
          <Button variant="contained" onClick={onComplete}>
            Next: Quiz →
          </Button>
        </Paper>
      ) : (
        <Button variant="contained" onClick={() => setChecked(true)}>
          Check Order
        </Button>
      )}
    </Box>
  );
};

// ─── Stage 3: Quiz ────────────────────────────────────────────────────────────

const Quiz = ({ onComplete }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[qIdx];
  const isLastQ = qIdx === QUESTIONS.length - 1;
  const isCorrect = selected === q?.correct;

  const confirmAnswer = () => {
    setConfirmed(true);
    setAnswers(prev => [...prev, { correct: isCorrect, bloomsLevel: q.bloomsLevel }]);
  };

  const nextQuestion = () => {
    setQIdx(qIdx + 1);
    setSelected(null);
    setConfirmed(false);
  };

  if (done) {
    const correctCount = answers.filter(a => a.correct).length;
    const score = Math.round((correctCount / QUESTIONS.length) * 100);
    const highestLevel = answers.filter(a => a.correct).reduce((max, a) => Math.max(max, a.bloomsLevel), 1);

    return (
      <Box sx={{ textAlign: 'center' }}>
        <EmojiEventsIcon sx={{
          fontSize: 64, mb: 2,
          color: score >= 80 ? '#00e5a0' : score >= 60 ? '#ff9800' : '#f44336',
        }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good effort!' : 'Keep practising!'}
        </Typography>
        <Typography variant="h2" fontWeight={800} color="primary.main" sx={{ mb: 0.5 }}>
          {score}%
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {correctCount} out of {QUESTIONS.length} correct
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          {answers.map((a, i) => (
            <Chip
              key={i}
              label={`Q${i + 1} ${QUESTIONS[i].bloomsLabel}`}
              size="small"
              icon={a.correct ? <CheckCircleIcon /> : undefined}
              color={a.correct ? 'success' : 'error'}
              variant="outlined"
            />
          ))}
        </Box>

        <Button variant="contained" size="large" onClick={() => onComplete(score, highestLevel)}>
          Save Progress & Finish
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Stage 3 — Quiz</Typography>
        <Typography variant="body2" color="text.secondary">
          {qIdx + 1} / {QUESTIONS.length}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(qIdx / QUESTIONS.length) * 100}
        sx={{ mb: 3, height: 4, borderRadius: 2 }}
      />

      <Chip
        label={q.bloomsLabel}
        size="small"
        sx={{
          mb: 2,
          bgcolor: `${BLOOMS_COLOURS[q.bloomsLevel]}18`,
          color: BLOOMS_COLOURS[q.bloomsLevel],
          border: `1px solid ${BLOOMS_COLOURS[q.bloomsLevel]}44`,
          fontWeight: 600,
        }}
      />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, lineHeight: 1.6 }}>
        {q.q}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {q.options.map((opt, i) => {
          let borderColor = 'rgba(255,255,255,0.08)';
          let bgcolor = 'rgba(255,255,255,0.03)';
          if (confirmed) {
            if (i === q.correct) {
              borderColor = 'rgba(0,229,160,0.4)';
              bgcolor = 'rgba(0,229,160,0.07)';
            } else if (i === selected) {
              borderColor = 'rgba(244,67,54,0.4)';
              bgcolor = 'rgba(244,67,54,0.07)';
            }
          } else if (selected === i) {
            borderColor = 'rgba(0,153,255,0.5)';
            bgcolor = 'rgba(0,153,255,0.08)';
          }

          return (
            <Box
              key={i}
              component="button"
              disabled={confirmed}
              onClick={() => setSelected(i)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 2, borderRadius: 2,
                border: '1px solid', borderColor, bgcolor,
                cursor: confirmed ? 'default' : 'pointer',
                transition: 'all 0.12s',
                textAlign: 'left',
                '&:not(:disabled):hover': {
                  bgcolor: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <Box sx={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: '2px solid',
                borderColor: selected === i ? '#0099ff' : 'rgba(255,255,255,0.2)',
                bgcolor: selected === i ? '#0099ff' : 'transparent',
                transition: 'all 0.12s',
              }} />
              <Typography variant="body1" sx={{ color: '#e8eaf0', flex: 1 }}>{opt}</Typography>
              {confirmed && i === q.correct && (
                <CheckCircleIcon sx={{ color: '#00e5a0', flexShrink: 0 }} />
              )}
            </Box>
          );
        })}
      </Box>

      {confirmed && (
        <Alert
          severity={isCorrect ? 'success' : 'error'}
          sx={{
            mb: 2,
            bgcolor: isCorrect ? 'rgba(0,229,160,0.06)' : 'rgba(244,67,54,0.06)',
            border: `1px solid ${isCorrect ? 'rgba(0,229,160,0.25)' : 'rgba(244,67,54,0.25)'}`,
            color: 'text.primary',
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
            {isCorrect ? 'Correct! ✓' : 'Not quite.'}
          </Typography>
          <Typography variant="body2">{q.explanation}</Typography>
        </Alert>
      )}

      {!confirmed ? (
        <Button variant="contained" disabled={selected === null} onClick={confirmAnswer}>
          Check Answer
        </Button>
      ) : isLastQ ? (
        <Button variant="contained" onClick={() => setDone(true)}>
          See Results →
        </Button>
      ) : (
        <Button variant="contained" onClick={nextQuestion}>
          Next Question →
        </Button>
      )}
    </Box>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const BinaryLesson = ({ onComplete = () => {} }) => {
  const [stage, setStage] = useState(0);

  return (
    <Box>
      {/* Stage progress header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          {STAGE_LABELS.map((label, i) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor:
                  i < stage ? '#00e5a0' :
                  i === stage ? 'primary.main' :
                  'rgba(255,255,255,0.08)',
                color: i <= stage ? '#0a0e1a' : 'rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800,
                transition: 'all 0.3s',
              }}>
                {i < stage ? '✓' : i + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: i === stage ? 700 : 400,
                  color: i === stage ? 'primary.main' : i < stage ? 'text.primary' : 'text.secondary',
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
        <LinearProgress
          variant="determinate"
          value={(stage / STAGE_LABELS.length) * 100}
          sx={{ height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}
        />
      </Box>

      {stage === 0 && <BitFlipper onComplete={() => setStage(1)} />}
      {stage === 1 && <SortChallenge onComplete={() => setStage(2)} />}
      {stage === 2 && <Quiz onComplete={onComplete} />}
    </Box>
  );
};

export default BinaryLesson;
