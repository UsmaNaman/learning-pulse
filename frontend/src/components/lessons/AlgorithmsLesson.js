import React, { useState, useEffect, useRef } from 'react';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const BG    = '#0a0e1a';
const ACCENT = '#00e5a0';
const SURFACE = 'rgba(255,255,255,0.04)';
const BORDER  = '1px solid rgba(255,255,255,0.08)';
const TEXT  = '#e8eaf0';
const MUTED = 'rgba(232,234,240,0.5)';

// ─── Data ──────────────────────────────────────────────────────────────────────
const STAGE_LABELS = ['Explore', 'Practise', 'Quiz'];

const EXPLORE_TABS = [
  { id: 'what',       label: 'What is an Algorithm?', icon: '🧩' },
  { id: 'sequence',   label: 'Sequence',               icon: '➡️' },
  { id: 'selection',  label: 'Selection',              icon: '🔀' },
  { id: 'iteration',  label: 'Iteration',              icon: '🔁' },
  { id: 'flowcharts', label: 'Flowcharts',             icon: '📊' },
];

const CORRECT_ORDER = [
  { id: 'a', text: 'START' },
  { id: 'b', text: 'Move right' },
  { id: 'c', text: 'IF gap THEN jump' },
  { id: 'd', text: 'Check if enemy nearby' },
  { id: 'e', text: 'WHILE coins remain collect coin' },
  { id: 'f', text: 'END' },
];

const SHUFFLED_ORDER = [
  CORRECT_ORDER[4],
  CORRECT_ORDER[0],
  CORRECT_ORDER[3],
  CORRECT_ORDER[5],
  CORRECT_ORDER[1],
  CORRECT_ORDER[2],
];

const LABEL_LINES = [
  { id: 1, code: 'score = score + 10',            answer: 'sequence',  hint: 'This just runs once in order — no condition, no loop.' },
  { id: 2, code: 'IF lives > 0 THEN continue',    answer: 'selection', hint: 'It makes a decision based on whether a condition is true.' },
  { id: 3, code: 'WHILE enemies remain DO attack', answer: 'iteration', hint: 'WHILE means it keeps repeating until the condition is false.' },
  { id: 4, code: 'playerName = "Hero"',            answer: 'sequence',  hint: 'Assigning a value — one step that runs in order.' },
];

const CONSTRUCT_OPTIONS  = ['sequence', 'selection', 'iteration'];
const CONSTRUCT_COLOURS  = { sequence: '#2196f3', selection: '#9c27b0', iteration: '#ff9800' };

const QUESTIONS = [
  {
    bloomsLevel: 1, bloomsLabel: 'Remember',
    q: 'What is an algorithm?',
    hint: 'Think of a recipe in a cookbook — what does it give you?',
    options: [
      'A programming language used to write games',
      'A precise set of step-by-step instructions that solves a problem',
      'A type of variable used to store numbers',
      'A drawing tool for creating flowcharts',
    ],
    correct: 1,
    explanation: 'An algorithm is a precise, finite sequence of step-by-step instructions designed to solve a problem or complete a task — like a recipe you follow to always get the same result.',
  },
  {
    bloomsLevel: 2, bloomsLabel: 'Understand',
    q: 'Which line shows SELECTION in this game pseudocode?\n\n1. player_x = player_x + 1\n2. IF player_health < 10 THEN show_warning()\n3. WHILE ammo > 0 DO shoot()\n4. score = score + 100',
    hint: 'Selection always involves checking a condition and branching.',
    options: [
      'Line 1 — it moves the player one step',
      'Line 2 — it checks a condition and decides what to do',
      'Line 3 — it keeps shooting while ammo is available',
      'Line 4 — it adds to the score',
    ],
    correct: 1,
    explanation: 'Line 2 is selection: IF player_health < 10 THEN show_warning(). It checks a condition and only runs show_warning() when TRUE. Lines 1 and 4 are sequence; Line 3 is iteration.',
  },
  {
    bloomsLevel: 3, bloomsLabel: 'Apply',
    q: 'A game enemy needs to keep patrolling left and right until the player is spotted. Which construct should the programmer use?',
    hint: 'The patrol must keep happening repeatedly until something changes.',
    options: [
      'Sequence — write the patrol steps once in order',
      'Selection — use IF spotted THEN stop patrolling',
      'Iteration — use WHILE not_spotted DO patrol()',
      'Declaration — declare the patrol route as a variable',
    ],
    correct: 2,
    explanation: 'Iteration is correct: WHILE not_spotted DO patrol(). The patrol must repeat continuously — sequence only runs once, and selection makes a single decision but doesn\'t keep repeating the patrol.',
  },
  {
    bloomsLevel: 4, bloomsLabel: 'Analyse',
    q: 'Original algorithm:\n1. Check if enemy nearby\n2. IF enemy THEN run away\n3. Collect coin\n\nA student swaps steps 1 and 3. What changes?',
    hint: 'Think about what could go wrong if you grab the coin before checking for enemies.',
    options: [
      'Nothing — all three steps still run so the result is the same',
      'The player tries to collect the coin before checking for enemies — risking taking damage',
      'The IF statement breaks because it no longer has a check before it',
      'The algorithm becomes more efficient because coins are collected first',
    ],
    correct: 1,
    explanation: 'Order matters! Originally the player checks for enemies first (safe), then collects the coin. After the swap, the coin is grabbed first — the enemy check happens too late and the player may already have taken damage.',
  },
  {
    bloomsLevel: 5, bloomsLabel: 'Evaluate',
    q: 'A game\'s main loop:\n\nWHILE game_running DO\n  update_enemies()\n  move_player()\n  check_collisions()\nENDWHILE\n\nA student removes the WHILE…ENDWHILE, keeping the three function calls. Evaluate what would happen.',
    hint: 'What does the WHILE loop give you that three plain lines can\'t?',
    options: [
      'Nothing changes — the three functions run the same way',
      'The game runs faster because there is less code to process',
      'The game updates once then stops — enemies move, player moves, collisions checked once, then the program ends',
      'The three functions crash because they require a loop context',
    ],
    correct: 2,
    explanation: 'Without the loop, each function runs exactly once and the program ends — the game "blinks" for one frame. The WHILE loop is the game\'s heartbeat: it repeats every frame to keep enemies moving, the player responsive, and collisions live.',
  },
];

const BLOOMS_COLOURS = { 1: '#2196f3', 2: '#9c27b0', 3: '#ff9800', 4: '#4caf50', 5: '#f44336' };

// ─── Shared helpers ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: SURFACE, border: BORDER, borderRadius: 12, padding: 16, ...style }}>
    {children}
  </div>
);

const KeyIdea = ({ children }) => (
  <div style={{ padding: '10px 14px', background: SURFACE, border: BORDER, borderRadius: 8, fontSize: 12, color: MUTED, marginTop: 16 }}>
    <strong style={{ color: TEXT }}>Key idea: </strong>{children}
  </div>
);

// ─── Explore: Tab 1 — What is an Algorithm ─────────────────────────────────────
const WhatIsAlgorithm = () => (
  <div>
    <p style={{ fontSize: 14, lineHeight: 1.8, color: TEXT, marginTop: 0, marginBottom: 16 }}>
      An <strong style={{ color: ACCENT }}>algorithm</strong> is a precise, ordered set of instructions
      that solves a problem. Think of it like a recipe — follow the steps and you always get the same result.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
      <div style={{ padding: 16, background: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1, marginBottom: 10 }}>✓ GOOD ALGORITHM</div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: TEXT, lineHeight: 2.1 }}>
          1. Boil water<br />
          2. Add pasta<br />
          3. Wait 10 minutes<br />
          4. Drain water<br />
          5. Serve
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: '10px 0 0' }}>Clear, unambiguous, always produces pasta ✓</p>
      </div>

      <div style={{ padding: 16, background: 'rgba(244,67,54,0.05)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f44336', letterSpacing: 1, marginBottom: 10 }}>✗ BAD ALGORITHM</div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: TEXT, lineHeight: 2.1 }}>
          1. Get some water<br />
          2. Make it hot or something<br />
          3. Put pasta in (maybe?)<br />
          4. Cook for a while<br />
          5. Done
        </div>
        <p style={{ fontSize: 12, color: '#f44336', margin: '10px 0 0' }}>Vague, ambiguous — a computer can't follow this ✗</p>
      </div>
    </div>

    <Card>
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1, marginBottom: 12 }}>THREE PROPERTIES EVERY ALGORITHM MUST HAVE</div>
      {[
        ['🎯 Precise',  'Every step must be clear and unambiguous — no guessing'],
        ['📋 Ordered',  'Steps must run in the correct sequence'],
        ['🏁 Finite',   'It must eventually stop and produce a result'],
      ].map(([title, desc]) => (
        <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, minWidth: 110 }}>{title}</span>
          <span style={{ fontSize: 13, color: MUTED }}>{desc}</span>
        </div>
      ))}
    </Card>
  </div>
);

// ─── Explore: Tab 2 — Sequence ────────────────────────────────────────────────
const SequenceDemo = () => {
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const ACTIONS = [
    { label: 'Move right', icon: '➡️', desc: 'Move to the platform' },
    { label: 'Jump',       icon: '⬆️', desc: 'Jump over the gap'   },
    { label: 'Collect coin', icon: '🪙', desc: 'Pick up the coin'  },
  ];

  const handlePress = (idx) => {
    if (idx === step) {
      setStep(step + 1);
      setErrorMsg('');
    } else {
      setErrorMsg(
        `Out of order! "${ACTIONS[idx].label}" is step ${idx + 1}, but we're on step ${step + 1}. ` +
        `Sequence means the ORDER is fixed — swap any two steps and the algorithm breaks.`
      );
    }
  };

  const charPos = step === 0 ? 0 : step >= 1 ? 3 : 0;
  const isJumping = step === 2;
  const coinGone  = step >= 3;

  return (
    <div>
      <p style={{ fontSize: 14, color: MUTED, marginTop: 0, marginBottom: 16 }}>
        Press the buttons <strong style={{ color: TEXT }}>in the correct order</strong>. Each step runs once — try pressing them out of order to see what happens.
      </p>

      {/* Game world */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: 60, height: 60,
            background: i === 1 ? 'rgba(244,67,54,0.08)' : SURFACE,
            border: `1px solid ${i === 1 ? 'rgba(244,67,54,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, position: 'relative', transition: 'all 0.3s',
          }}>
            {i === 1 && <span style={{ fontSize: 18 }}>⬇️</span>}
            {charPos === i && (
              <span style={{
                position: 'absolute', fontSize: 24,
                transform: isJumping ? 'translateY(-22px)' : 'translateY(0)',
                transition: 'transform 0.25s',
              }}>
                {step >= 3 ? '🏆' : '🏃'}
              </span>
            )}
            {i === 4 && !coinGone && charPos !== i && <span>🪙</span>}
          </div>
        ))}
      </div>

      {/* Step buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {ACTIONS.map((action, idx) => (
          <button
            key={idx}
            disabled={step >= 3}
            onClick={() => handlePress(idx)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, cursor: step >= 3 ? 'default' : 'pointer',
              background: step > idx ? 'rgba(0,229,160,0.08)' : SURFACE,
              border: `1px solid ${step > idx ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: step > idx ? ACCENT : TEXT,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 20 }}>{step > idx ? '✓' : action.icon}</span>
            <span>{action.label}</span>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>Step {idx + 1}</span>
          </button>
        ))}
      </div>

      {errorMsg && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,67,54,0.07)', border: '1px solid rgba(244,67,54,0.25)', borderRadius: 8, fontSize: 13, color: '#ef9a9a', marginBottom: 8 }}>
          {errorMsg}
        </div>
      )}
      {step === 3 && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 8, fontSize: 13, color: ACCENT, textAlign: 'center' }}>
          🎉 Perfect sequence! All 3 steps ran in the correct order.
        </div>
      )}

      <KeyIdea>
        In sequence, each instruction runs <em>once</em>, in the <em>exact order written</em>. Swap any two steps and the algorithm breaks.
      </KeyIdea>
    </div>
  );
};

// ─── Explore: Tab 3 — Selection ───────────────────────────────────────────────
const SelectionDemo = () => {
  const [result, setResult] = useState(null);

  return (
    <div>
      <p style={{ fontSize: 14, color: MUTED, marginTop: 0, marginBottom: 16 }}>
        Selection runs <strong style={{ color: TEXT }}>different code</strong> depending on whether a condition is TRUE or FALSE. Test both paths below:
      </p>

      <div style={{ fontFamily: 'monospace', fontSize: 14, background: 'rgba(0,0,0,0.3)', border: BORDER, borderRadius: 10, padding: '14px 18px', marginBottom: 20, lineHeight: 2.2 }}>
        <span style={{ color: '#9c27b0', fontWeight: 700 }}>IF </span>
        <span style={{ color: TEXT }}>character_touches_enemy </span>
        <span style={{ color: '#9c27b0', fontWeight: 700 }}>THEN</span>
        <br />
        <span style={{ color: TEXT }}>    lose_life()</span>
        {result === 'enemy' && <span style={{ color: '#f44336', marginLeft: 12, fontSize: 12 }}>← running ✓</span>}
        <br />
        <span style={{ color: '#9c27b0', fontWeight: 700 }}>ELSE</span>
        <br />
        <span style={{ color: TEXT }}>    keep_running()</span>
        {result === 'safe' && <span style={{ color: ACCENT, marginLeft: 12, fontSize: 12 }}>← running ✓</span>}
        <br />
        <span style={{ color: '#9c27b0', fontWeight: 700 }}>ENDIF</span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[
          { key: 'enemy', label: '👾 Touch enemy',  sub: 'condition = TRUE',  active: 'rgba(244,67,54,0.12)', activeBorder: 'rgba(244,67,54,0.4)', activeText: '#f44336' },
          { key: 'safe',  label: '✅ Avoid enemy', sub: 'condition = FALSE', active: 'rgba(0,229,160,0.08)',  activeBorder: 'rgba(0,229,160,0.3)',  activeText: ACCENT  },
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setResult(btn.key)}
            style={{
              flex: 1, padding: 14, borderRadius: 10, cursor: 'pointer',
              background: result === btn.key ? btn.active : SURFACE,
              border: `1px solid ${result === btn.key ? btn.activeBorder : 'rgba(255,255,255,0.1)'}`,
              color: result === btn.key ? btn.activeText : TEXT,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.2s', lineHeight: 1.8,
            }}
          >
            {btn.label}<br />
            <span style={{ fontSize: 12, fontWeight: 400, color: MUTED }}>{btn.sub}</span>
          </button>
        ))}
      </div>

      {result === 'enemy' && (
        <div style={{ padding: '12px 16px', background: 'rgba(244,67,54,0.07)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 10, marginBottom: 8, fontSize: 13 }}>
          <strong style={{ color: '#f44336' }}>Condition TRUE → THEN branch runs</strong>
          <p style={{ color: MUTED, margin: '4px 0 0' }}>
            The character touched the enemy, so <code style={{ color: TEXT }}>lose_life()</code> executes. The ELSE branch is completely skipped.
          </p>
        </div>
      )}
      {result === 'safe' && (
        <div style={{ padding: '12px 16px', background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 10, marginBottom: 8, fontSize: 13 }}>
          <strong style={{ color: ACCENT }}>Condition FALSE → ELSE branch runs</strong>
          <p style={{ color: MUTED, margin: '4px 0 0' }}>
            The enemy was avoided, so <code style={{ color: TEXT }}>keep_running()</code> executes. The THEN branch is completely skipped.
          </p>
        </div>
      )}

      <KeyIdea>
        Selection only ever runs <em>one</em> branch — THEN or ELSE, never both. The condition decides which path is taken.
      </KeyIdea>
    </div>
  );
};

// ─── Explore: Tab 4 — Iteration ───────────────────────────────────────────────
const IterationDemo = () => {
  const [lives, setLives]       = useState(3);
  const [loopCount, setLoopCount] = useState(0);
  const [log, setLog]           = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const runLoop = () => {
    if (gameOver) return;
    const n = loopCount + 1;
    setLoopCount(n);
    setLog(prev => [
      ...prev,
      { type: 'loop',   text: `── Iteration ${n} ──────────` },
      { type: 'action', text: `  update_enemies()   ✓` },
      { type: 'action', text: `  move_player()      ✓` },
      { type: 'action', text: `  check_collisions() ✓` },
    ]);
  };

  const takeDamage = () => {
    if (gameOver) return;
    const newLives = lives - 1;
    setLives(newLives);
    setLog(prev => [...prev, { type: 'damage', text: `  ⚠ Damage! lives = ${newLives}` }]);
    if (newLives <= 0) {
      setGameOver(true);
      setLog(prev => [...prev, { type: 'end', text: `  game_running → false → loop exits` }]);
    }
  };

  const reset = () => { setLives(3); setLoopCount(0); setLog([]); setGameOver(false); };

  return (
    <div>
      <p style={{ fontSize: 14, color: MUTED, marginTop: 0, marginBottom: 16 }}>
        Iteration runs a block of code <strong style={{ color: TEXT }}>repeatedly</strong> while a condition is true. This is how every game loop works — run the loop and take damage to see what happens.
      </p>

      <div style={{ fontFamily: 'monospace', fontSize: 13, background: 'rgba(0,0,0,0.3)', border: BORDER, borderRadius: 10, padding: '12px 16px', marginBottom: 16, lineHeight: 2.1 }}>
        <span style={{ color: '#ff9800', fontWeight: 700 }}>WHILE </span>
        <span style={{ color: TEXT }}>game_running </span>
        <span style={{ color: '#ff9800', fontWeight: 700 }}>DO</span><br />
        <span style={{ color: TEXT }}>{'    '}update_enemies()</span><br />
        <span style={{ color: TEXT }}>{'    '}move_player()</span><br />
        <span style={{ color: TEXT }}>{'    '}check_collisions()</span><br />
        <span style={{ color: '#ff9800', fontWeight: 700 }}>ENDWHILE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 22 }}>
          {[0,1,2].map(i => <span key={i} style={{ opacity: i < lives ? 1 : 0.2, marginRight: 2 }}>❤️</span>)}
        </div>
        <span style={{ fontSize: 13, color: MUTED }}>
          Loop ran <strong style={{ color: TEXT }}>{loopCount}</strong>×
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={runLoop} disabled={gameOver} style={{
          flex: 1, padding: 12, borderRadius: 10,
          cursor: gameOver ? 'not-allowed' : 'pointer',
          background: gameOver ? 'rgba(255,255,255,0.02)' : 'rgba(0,229,160,0.1)',
          border: `1px solid ${gameOver ? 'rgba(255,255,255,0.05)' : 'rgba(0,229,160,0.3)'}`,
          color: gameOver ? MUTED : ACCENT,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>▶ Run loop step</button>

        <button onClick={takeDamage} disabled={gameOver} style={{
          flex: 1, padding: 12, borderRadius: 10,
          cursor: gameOver ? 'not-allowed' : 'pointer',
          background: gameOver ? 'rgba(255,255,255,0.02)' : 'rgba(244,67,54,0.08)',
          border: `1px solid ${gameOver ? 'rgba(255,255,255,0.05)' : 'rgba(244,67,54,0.2)'}`,
          color: gameOver ? MUTED : '#f44336',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>💥 Take damage</button>

        <button onClick={reset} style={{
          padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
          background: SURFACE, border: BORDER,
          color: MUTED, fontSize: 13, fontFamily: 'inherit',
        }}>↺</button>
      </div>

      <div ref={logRef} style={{
        fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9,
        background: 'rgba(0,0,0,0.4)', border: BORDER, borderRadius: 10,
        padding: 12, height: 130, overflowY: 'auto',
      }}>
        {log.length === 0
          ? <span style={{ color: 'rgba(232,234,240,0.2)' }}>Press "Run loop step" to start…</span>
          : log.map((e, i) => (
              <div key={i} style={{
                color: e.type === 'loop' ? '#2196f3' : e.type === 'damage' ? '#f44336' : e.type === 'end' ? ACCENT : 'rgba(232,234,240,0.7)',
                fontWeight: e.type === 'loop' ? 600 : 400,
              }}>{e.text}</div>
            ))
        }
      </div>

      {gameOver && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 8, fontSize: 13, color: ACCENT }}>
          💡 Lives hit 0 → <code style={{ color: TEXT }}>game_running = false</code>. The WHILE condition is now FALSE, so the loop exits.
        </div>
      )}

      <KeyIdea>
        Iteration repeats a block of code while a condition stays true. When the condition becomes false, the loop stops. Without it, your game would only update once.
      </KeyIdea>
    </div>
  );
};

// ─── Explore: Tab 5 — Flowcharts ──────────────────────────────────────────────
const FlowchartsRef = () => {
  const SHAPES = [
    { name: 'Start / End', colour: '#00e5a0', example: 'START, END',          shape: 'oval',           desc: 'Marks where the algorithm begins and finishes. Every flowchart must have exactly one START and at least one END.' },
    { name: 'Process',     colour: '#2196f3', example: 'score = score + 1',   shape: 'rectangle',      desc: 'An action or instruction — an assignment, calculation, or procedure call. Runs in sequence.' },
    { name: 'Decision',    colour: '#9c27b0', example: 'Is lives > 0?',       shape: 'diamond',        desc: 'A YES/NO question. Two paths exit (True/False). This is how IF/selection looks in a flowchart.' },
    { name: 'Input/Output',colour: '#ff9800', example: 'INPUT name, OUTPUT score', shape: 'parallelogram', desc: 'Data entering (user types) or leaving (display result) the algorithm.' },
  ];

  const shapeStyle = (shape, colour) => {
    const base = {
      width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${colour}16`, border: `2px solid ${colour}55`, marginBottom: 10, flexShrink: 0,
    };
    if (shape === 'oval')          return { ...base, borderRadius: 22 };
    if (shape === 'rectangle')     return { ...base, borderRadius: 4 };
    if (shape === 'diamond')       return { ...base, borderRadius: 4, transform: 'rotate(45deg)' };
    if (shape === 'parallelogram') return { ...base, borderRadius: 4, transform: 'skewX(-12deg)' };
    return base;
  };

  const iconStyle = (shape) => shape === 'diamond' ? { transform: 'rotate(-45deg)', fontSize: 18 } : { fontSize: 18 };

  return (
    <div>
      <p style={{ fontSize: 14, color: MUTED, marginTop: 0, marginBottom: 16 }}>
        Flowcharts are a visual way to represent an algorithm. Each shape has a specific, fixed meaning:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
        {SHAPES.map(s => (
          <div key={s.name} style={{ padding: 16, background: SURFACE, border: BORDER, borderRadius: 12 }}>
            <div style={shapeStyle(s.shape, s.colour)}>
              <span style={iconStyle(s.shape)}>
                {s.shape === 'oval' ? '○' : s.shape === 'rectangle' ? '▭' : s.shape === 'diamond' ? '◆' : '▱'}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.colour, marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: ACCENT, marginBottom: 8 }}>{s.example}</div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Stage 0: Explore ──────────────────────────────────────────────────────────
const ExplorePart = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('what');
  const [visited, setVisited]     = useState(new Set(['what']));

  const visit = (id) => {
    setActiveTab(id);
    setVisited(prev => new Set([...prev, id]));
  };

  const allVisited = EXPLORE_TABS.every(t => visited.has(t.id));

  const renderTab = () => {
    switch (activeTab) {
      case 'what':       return <WhatIsAlgorithm />;
      case 'sequence':   return <SequenceDemo />;
      case 'selection':  return <SelectionDemo />;
      case 'iteration':  return <IterationDemo />;
      case 'flowcharts': return <FlowchartsRef />;
      default:           return null;
    }
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
        Visit all 5 tabs — they unlock the practice activities.
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {EXPLORE_TABS.map(tab => {
          const isActive  = activeTab === tab.id;
          const isVisited = visited.has(tab.id);
          return (
            <button key={tab.id} onClick={() => visit(tab.id)} style={{
              padding: '7px 13px', borderRadius: 8, cursor: 'pointer', flexShrink: 0,
              background: isActive ? 'rgba(0,229,160,0.12)' : SURFACE,
              border: `1px solid ${isActive ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: isActive ? ACCENT : isVisited ? TEXT : MUTED,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
              {tab.icon} {tab.label}
              {isVisited && !isActive && <span style={{ marginLeft: 5, color: ACCENT, fontSize: 10 }}>✓</span>}
            </button>
          );
        })}
      </div>

      <div style={{ minHeight: 280 }}>{renderTab()}</div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onComplete} disabled={!allVisited} style={{
          padding: '12px 24px', borderRadius: 10, fontFamily: 'inherit',
          background: allVisited ? ACCENT : 'rgba(255,255,255,0.04)',
          border: `1px solid ${allVisited ? ACCENT : 'rgba(255,255,255,0.08)'}`,
          color: allVisited ? BG : MUTED,
          fontSize: 14, fontWeight: 700,
          cursor: allVisited ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        }}>
          {allVisited ? 'Start Practise →' : `Visit all tabs to continue (${visited.size}/5)`}
        </button>
      </div>
    </div>
  );
};

// ─── Stage 1: Practise — Drag-and-drop ────────────────────────────────────────
const DragDropActivity = ({ onComplete }) => {
  const [items, setItems]     = useState([...SHUFFLED_ORDER]);
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = (i) => items[i].id === CORRECT_ORDER[i].id;
  const allCorrect = items.every((_, i) => isCorrect(i));

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragIdx(i);
    setChecked(false);
  };
  const onDrop = () => setDragIdx(null);

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginTop: 0, marginBottom: 4 }}>Activity 1 — Sort the Algorithm</h3>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
        Drag the six steps into the correct order for a simple platformer game character.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {items.map((item, i) => {
          let bg     = SURFACE;
          let border = 'rgba(255,255,255,0.08)';
          if (dragIdx === i)       { bg = 'rgba(0,153,255,0.1)'; border = 'rgba(0,153,255,0.4)'; }
          else if (checked) {
            bg     = isCorrect(i) ? 'rgba(0,229,160,0.07)' : 'rgba(244,67,54,0.07)';
            border = isCorrect(i) ? 'rgba(0,229,160,0.4)'  : 'rgba(244,67,54,0.4)';
          }
          return (
            <div key={item.id} draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={onDrop}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: bg, border: `1px solid ${border}`,
                cursor: 'grab', userSelect: 'none', transition: 'all 0.15s',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>⣿</span>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: MUTED,
              }}>{i + 1}</div>
              <span style={{ fontFamily: 'monospace', fontSize: 14, color: TEXT, flex: 1 }}>{item.text}</span>
              {checked && <span style={{ fontSize: 16, flexShrink: 0 }}>{isCorrect(i) ? '✓' : '✗'}</span>}
            </div>
          );
        })}
      </div>

      {checked && (allCorrect
        ? <div style={{ padding: '12px 16px', background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 10, fontSize: 13, color: ACCENT, marginBottom: 12 }}>
            ✓ Correct! START → Move right → check for gaps → check for enemies → collect coins → END.
          </div>
        : <div style={{ padding: '12px 16px', background: 'rgba(244,67,54,0.07)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 10, fontSize: 13, color: '#f44336', marginBottom: 12 }}>
            Not quite — red slots are wrong. Think about what the character should do first. Try again!
          </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {(!checked || !allCorrect) && (
          <button onClick={() => setChecked(true)} style={{
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(0,153,255,0.1)', border: '1px solid rgba(0,153,255,0.3)',
            color: '#2196f3', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>Check Order</button>
        )}
        {checked && allCorrect && (
          <button onClick={onComplete} style={{
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
            background: ACCENT, border: 'none', color: BG,
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          }}>Next activity →</button>
        )}
      </div>
    </div>
  );
};

// ─── Stage 1: Practise — Label activity ───────────────────────────────────────
const LabelActivity = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [hints, setHints]     = useState({});

  const allAnswered = LABEL_LINES.every(l => answers[l.id]);
  const allCorrect  = LABEL_LINES.every(l => answers[l.id] === l.answer);

  const pick = (lineId, opt) => { if (!checked) setAnswers(p => ({ ...p, [lineId]: opt })); };
  const toggleHint = (id) => setHints(p => ({ ...p, [id]: !p[id] }));

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginTop: 0, marginBottom: 4 }}>Activity 2 — Label the Constructs</h3>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
        For each line of pseudocode, choose whether it shows sequence, selection, or iteration.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {LABEL_LINES.map(line => {
          const sel = answers[line.id];
          const correct = sel === line.answer;
          return (
            <div key={line.id} style={{ padding: 14, background: SURFACE, border: BORDER, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <code style={{ fontFamily: 'monospace', fontSize: 13, color: TEXT, background: 'rgba(0,0,0,0.3)', padding: '3px 10px', borderRadius: 6 }}>
                  {line.code}
                </code>
                <button onClick={() => toggleHint(line.id)} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                  padding: '3px 8px', color: MUTED, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit', flexShrink: 0, marginLeft: 8,
                }}>💡 hint</button>
              </div>

              {hints[line.id] && (
                <div style={{ fontSize: 12, color: '#64b5f6', marginBottom: 8, fontStyle: 'italic' }}>{line.hint}</div>
              )}

              <div style={{ display: 'flex', gap: 6 }}>
                {CONSTRUCT_OPTIONS.map(opt => {
                  const isSelected = sel === opt;
                  const colour = CONSTRUCT_COLOURS[opt];
                  let bg = SURFACE, border = 'rgba(255,255,255,0.08)', textColor = MUTED;

                  if (isSelected && !checked) { bg = `${colour}18`; border = `${colour}55`; textColor = colour; }
                  if (checked) {
                    if (opt === line.answer)          { bg = 'rgba(0,229,160,0.07)'; border = 'rgba(0,229,160,0.35)'; textColor = ACCENT; }
                    if (isSelected && !correct)       { bg = 'rgba(244,67,54,0.07)'; border = 'rgba(244,67,54,0.35)'; textColor = '#f44336'; }
                    if (isSelected && correct)        { bg = 'rgba(0,229,160,0.1)';  border = 'rgba(0,229,160,0.4)';  textColor = ACCENT; }
                  }

                  return (
                    <button key={opt} disabled={checked} onClick={() => pick(line.id, opt)} style={{
                      flex: 1, padding: '6px 4px', borderRadius: 8,
                      cursor: checked ? 'default' : 'pointer',
                      background: bg, border: `1px solid ${border}`,
                      color: textColor, fontSize: 12, fontWeight: isSelected ? 600 : 400,
                      textTransform: 'capitalize', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>{opt}</button>
                  );
                })}
              </div>

              {checked && (
                <div style={{ marginTop: 8, fontSize: 12, color: correct ? ACCENT : '#f44336' }}>
                  {correct ? `✓ Correct — this is ${line.answer}` : `✗ This is ${line.answer}`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!checked && (
          <button onClick={() => setChecked(true)} disabled={!allAnswered} style={{
            padding: '10px 20px', borderRadius: 10,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            background: allAnswered ? 'rgba(0,153,255,0.1)' : SURFACE,
            border: `1px solid ${allAnswered ? 'rgba(0,153,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
            color: allAnswered ? '#2196f3' : MUTED,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>Check Answers</button>
        )}
        {checked && (
          <button onClick={onComplete} style={{
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
            background: allCorrect ? ACCENT : 'rgba(255,165,0,0.12)',
            border: `1px solid ${allCorrect ? ACCENT : 'rgba(255,165,0,0.3)'}`,
            color: allCorrect ? BG : '#ff9800',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          }}>{allCorrect ? 'Unlock Quiz →' : 'Continue to Quiz →'}</button>
        )}
      </div>
    </div>
  );
};

// ─── Stage 1 wrapper ───────────────────────────────────────────────────────────
const PractisePart = ({ onComplete }) => {
  const [activity, setActivity] = useState(0);
  const [dragDone, setDragDone] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['Sort the Steps', 'Label the Constructs'].map((label, i) => (
          <div key={i}
            onClick={() => (i === 0 || dragDone) && setActivity(i)}
            style={{
              flex: 1, padding: 10, textAlign: 'center', borderRadius: 10,
              background: activity === i ? 'rgba(0,229,160,0.08)' : SURFACE,
              border: `1px solid ${activity === i ? 'rgba(0,229,160,0.25)' : 'rgba(255,255,255,0.08)'}`,
              color: activity === i ? ACCENT : (i === 1 && !dragDone) ? MUTED : TEXT,
              fontSize: 13, fontWeight: 600,
              cursor: (i === 1 && !dragDone) ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {dragDone && i === 0 ? '✓ ' : `${i + 1}. `}{label}
          </div>
        ))}
      </div>

      {activity === 0 && (
        <DragDropActivity onComplete={() => { setDragDone(true); setActivity(1); }} />
      )}
      {activity === 1 && (
        <LabelActivity onComplete={onComplete} />
      )}
    </div>
  );
};

// ─── Stage 2: Quiz ─────────────────────────────────────────────────────────────
const QuizPart = ({ onComplete }) => {
  const [qIdx, setQIdx]         = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers]   = useState([]);
  const [done, setDone]         = useState(false);

  const q = QUESTIONS[qIdx];
  const isRight = selected === q.correct;

  const confirm = () => {
    setConfirmed(true);
    setAnswers(prev => [...prev, { correct: selected === q.correct, bloomsLevel: q.bloomsLevel }]);
  };

  const next = () => {
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setConfirmed(false);
      setShowHint(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const correctCount = answers.filter(a => a.correct).length;
    const score        = Math.round((correctCount / QUESTIONS.length) * 100);
    const topLevel     = answers.filter(a => a.correct).reduce((m, a) => Math.max(m, a.bloomsLevel), 1);

    return (
      <div style={{ textAlign: 'center', padding: '28px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>
          {score >= 80 ? '🏆' : score >= 60 ? '⭐' : '📚'}
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: ACCENT, marginBottom: 4 }}>{score}%</div>
        <div style={{ fontSize: 14, color: MUTED, marginBottom: 24 }}>
          {correctCount} out of {QUESTIONS.length} correct
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: a.correct ? 'rgba(0,229,160,0.1)' : 'rgba(244,67,54,0.1)',
              border: `1px solid ${a.correct ? 'rgba(0,229,160,0.3)' : 'rgba(244,67,54,0.3)'}`,
              color: a.correct ? ACCENT : '#f44336',
            }}>
              Q{i + 1} {QUESTIONS[i].bloomsLabel} {a.correct ? '✓' : '✗'}
            </div>
          ))}
        </div>

        {onComplete && (
          <button onClick={() => onComplete(score, topLevel)} style={{
            padding: '13px 32px', borderRadius: 12, cursor: 'pointer',
            background: ACCENT, border: 'none', color: BG,
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
          }}>Save Progress & Finish</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Stage 3 — Quiz</span>
        <span style={{ fontSize: 13, color: MUTED }}>Question {qIdx + 1} of {QUESTIONS.length}</span>
      </div>

      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${(qIdx / QUESTIONS.length) * 100}%`, background: ACCENT, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>

      {/* Bloom's badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, marginBottom: 14,
        background: `${BLOOMS_COLOURS[q.bloomsLevel]}18`,
        border: `1px solid ${BLOOMS_COLOURS[q.bloomsLevel]}44`,
        fontSize: 12, fontWeight: 600, color: BLOOMS_COLOURS[q.bloomsLevel],
      }}>{q.bloomsLabel}</div>

      <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, lineHeight: 1.65, whiteSpace: 'pre-line', marginBottom: 18 }}>
        {q.q}
      </div>

      {/* Hint toggle */}
      <button onClick={() => setShowHint(!showHint)} style={{
        background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
        padding: '4px 12px', color: MUTED, fontSize: 12, cursor: 'pointer',
        fontFamily: 'inherit', marginBottom: showHint ? 8 : 16,
      }}>💡 {showHint ? 'Hide hint' : 'Show hint'}</button>

      {showHint && (
        <div style={{ padding: '8px 14px', background: 'rgba(33,150,243,0.07)', border: '1px solid rgba(33,150,243,0.2)', borderRadius: 8, fontSize: 13, color: '#90caf9', marginBottom: 14, fontStyle: 'italic' }}>
          {q.hint}
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          let bg = SURFACE, border = 'rgba(255,255,255,0.08)', textColor = TEXT;
          if (!confirmed && selected === i)        { bg = 'rgba(0,153,255,0.1)'; border = 'rgba(0,153,255,0.4)'; textColor = '#90caf9'; }
          if (confirmed && i === q.correct)        { bg = 'rgba(0,229,160,0.08)'; border = 'rgba(0,229,160,0.4)'; textColor = ACCENT; }
          if (confirmed && i === selected && !isRight) { bg = 'rgba(244,67,54,0.08)'; border = 'rgba(244,67,54,0.4)'; textColor = '#ef9a9a'; }

          return (
            <button key={i} disabled={confirmed} onClick={() => setSelected(i)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '11px 14px', borderRadius: 10, textAlign: 'left',
              background: bg, border: `1px solid ${border}`,
              cursor: confirmed ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                border: `2px solid ${selected === i && !confirmed ? '#0099ff' : 'rgba(255,255,255,0.2)'}`,
                background: selected === i && !confirmed ? '#0099ff22' : 'transparent',
              }} />
              <span style={{ fontSize: 14, color: textColor, lineHeight: 1.5 }}>{opt}</span>
              {confirmed && i === q.correct && <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 16 }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 16,
          background: isRight ? 'rgba(0,229,160,0.07)' : 'rgba(244,67,54,0.07)',
          border: `1px solid ${isRight ? 'rgba(0,229,160,0.25)' : 'rgba(244,67,54,0.25)'}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isRight ? ACCENT : '#f44336', marginBottom: 4 }}>
            {isRight ? '✓ Correct!' : '✗ Not quite.'}
          </div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{q.explanation}</div>
        </div>
      )}

      {!confirmed ? (
        <button disabled={selected === null} onClick={confirm} style={{
          padding: '10px 24px', borderRadius: 10,
          background: selected !== null ? 'rgba(0,153,255,0.12)' : SURFACE,
          border: `1px solid ${selected !== null ? 'rgba(0,153,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
          color: selected !== null ? '#2196f3' : MUTED,
          fontSize: 13, fontWeight: 600,
          cursor: selected !== null ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', transition: 'all 0.15s',
        }}>Check Answer</button>
      ) : qIdx < QUESTIONS.length - 1 ? (
        <button onClick={next} style={{
          padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
          background: ACCENT, border: 'none', color: BG,
          fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
        }}>Next Question →</button>
      ) : (
        <button onClick={() => setDone(true)} style={{
          padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
          background: ACCENT, border: 'none', color: BG,
          fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
        }}>See Results →</button>
      )}
    </div>
  );
};

// ─── Stage progress bar ────────────────────────────────────────────────────────
const StageBar = ({ stage }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      {STAGE_LABELS.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: i < stage ? ACCENT : i === stage ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.05)',
            border: `2px solid ${i <= stage ? ACCENT : 'rgba(255,255,255,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            color: i < stage ? BG : i === stage ? ACCENT : MUTED,
            transition: 'all 0.3s',
          }}>
            {i < stage ? '✓' : i + 1}
          </div>
          <span style={{ fontSize: 13, fontWeight: i === stage ? 600 : 400, color: i === stage ? TEXT : MUTED }}>
            {label}
          </span>
        </div>
      ))}
    </div>
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
      <div style={{ height: '100%', width: `${(stage / 3) * 100}%`, background: ACCENT, borderRadius: 2, transition: 'width 0.5s ease' }} />
    </div>
  </div>
);

// ─── Main export ───────────────────────────────────────────────────────────────
const AlgorithmsLesson = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: TEXT }}>
      <StageBar stage={stage} />
      {stage === 0 && <ExplorePart  onComplete={() => setStage(1)} />}
      {stage === 1 && <PractisePart onComplete={() => setStage(2)} />}
      {stage === 2 && <QuizPart     onComplete={onComplete} />}
    </div>
  );
};

export default AlgorithmsLesson;
