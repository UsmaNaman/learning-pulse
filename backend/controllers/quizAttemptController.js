const { validationResult } = require('express-validator');
const { User } = require('../models');
const QuizAttempt = require('../models/QuizAttempt');

const { TRACKED_TOPICS } = QuizAttempt;

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
// Mastery = average of the most recent attempts, so improvement shows quickly
const RECENT_ATTEMPTS_FOR_MASTERY = 3;
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const RISK_ORDER = { high: 0, medium: 1, low: 2 };

const average = (numbers) => (
  numbers.length ? Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length) : null
);

// Monday 00:00 UTC of the week containing `date`, as a timestamp
const startOfWeek = (date) => {
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return day - daysSinceMonday * DAY_MS;
};

// Consecutive weeks with at least one attempt, counting back from this week.
// A student who hasn't practised yet this week keeps last week's streak.
const calculateWeeklyStreak = (attempts, now) => {
  const activeWeeks = new Set(attempts.map(a => startOfWeek(a.completedAt)));
  let week = startOfWeek(now);
  if (!activeWeeks.has(week)) week -= WEEK_MS;

  let streak = 0;
  while (activeWeeks.has(week)) {
    streak += 1;
    week -= WEEK_MS;
  }
  return streak;
};

const skillLevelFor = (mastery) => {
  if (mastery < 40) return 'Beginner';
  if (mastery < 65) return 'Intermediate';
  if (mastery < 85) return 'Advanced';
  return 'Expert';
};

// Same thresholds as the demo dashboard: low mastery or no recent practice
const riskLevelFor = (mastery, weeklyStreak) => {
  if (mastery < 50 || weeklyStreak === 0) return 'high';
  if (mastery < 65 || weeklyStreak < 2) return 'medium';
  return 'low';
};

// Build one student's dashboard entry from their attempts (newest first)
const summariseStudent = (student, attempts, now) => {
  const attemptsByTopic = {};
  attempts.forEach(attempt => {
    (attemptsByTopic[attempt.topic] = attemptsByTopic[attempt.topic] || []).push(attempt);
  });

  // Untouched topics stay null ("Not started") rather than counting as 0%
  const topicMastery = Object.entries(TRACKED_TOPICS).map(([topicId, topicName]) => {
    const topicAttempts = attemptsByTopic[topicId] || [];
    return {
      topicId,
      topic: topicName,
      mastery: average(topicAttempts.slice(0, RECENT_ATTEMPTS_FOR_MASTERY).map(a => a.score)),
      attempts: topicAttempts.length
    };
  });

  const startedTopics = topicMastery.filter(t => t.mastery !== null);
  const overallMastery = average(startedTopics.map(t => t.mastery));
  const weeklyStreak = calculateWeeklyStreak(attempts, now);
  const hasStarted = attempts.length > 0;

  return {
    student: {
      id: student._id.toString(),
      name: student.username || student.name,
      email: student.email || '',
      group: student.class || ''
    },
    progress: {
      skillLevel: hasStarted ? skillLevelFor(overallMastery) : 'Not started',
      overallMastery,
      totalPoints: attempts.reduce((sum, a) => sum + a.score, 0),
      activitiesCompleted: attempts.length,
      lastActive: hasStarted ? attempts[0].completedAt : null,
      weeklyStreak,
      riskLevel: hasStarted ? riskLevelFor(overallMastery, weeklyStreak) : null,
      strengths: startedTopics.filter(t => t.mastery >= 70).map(t => t.topic),
      weaknesses: startedTopics.filter(t => t.mastery < 50).map(t => t.topic),
      topicMastery
    }
  };
};

// Class-wide figures for the summary cards, computed from the student entries
const summariseClass = (summaries, attemptsByStudent, now) => {
  const started = summaries.filter(s => s.progress.activitiesCompleted > 0);
  const weekAgo = new Date(now.getTime() - WEEK_MS);
  const recentAttempts = Object.values(attemptsByStudent).flat().filter(a => a.completedAt >= weekAgo);

  const topicAverages = Object.entries(TRACKED_TOPICS).map(([topicId, topicName]) => {
    const masteries = summaries
      .map(s => s.progress.topicMastery.find(t => t.topicId === topicId).mastery)
      .filter(m => m !== null);
    return {
      name: topicName,
      averageMastery: average(masteries),
      strugglingCount: masteries.filter(m => m < 50).length
    };
  }).filter(t => t.averageMastery !== null);

  const skillLevelDistribution = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
  started.forEach(s => { skillLevelDistribution[s.progress.skillLevel.toLowerCase()] += 1; });

  const weeklyActivity = DAY_NAMES.map(day => ({ day, count: 0 }));
  recentAttempts.forEach(a => { weeklyActivity[(a.completedAt.getUTCDay() + 6) % 7].count += 1; });

  // Average change from first to latest attempt, per student per topic (needs 2+ attempts)
  const improvements = [];
  Object.values(attemptsByStudent).forEach(attempts => {
    Object.keys(TRACKED_TOPICS).forEach(topicId => {
      const topicAttempts = attempts.filter(a => a.topic === topicId);
      if (topicAttempts.length >= 2) {
        improvements.push(topicAttempts[0].score - topicAttempts[topicAttempts.length - 1].score);
      }
    });
  });

  const averageMastery = average(started.map(s => s.progress.overallMastery)) || 0;

  return {
    totalStudents: summaries.length,
    averageMastery,
    overallProgress: averageMastery,
    activeStudentsThisWeek: new Set(recentAttempts.map(a => a.student.toString())).size,
    atRiskStudents: summaries.filter(s => s.progress.riskLevel === 'high').length,
    skillLevelDistribution,
    averagePoints: average(summaries.map(s => s.progress.totalPoints)) || 0,
    activitiesPerWeek: recentAttempts.length,
    topPerformingTopics: topicAverages
      .filter(t => t.averageMastery >= 70)
      .sort((a, b) => b.averageMastery - a.averageMastery)
      .map(({ name, averageMastery: topicAverage }) => ({ name, averageMastery: topicAverage })),
    strugglingTopics: topicAverages
      .filter(t => t.averageMastery < 50)
      .sort((a, b) => a.averageMastery - b.averageMastery)
      .map(({ name, averageMastery: topicAverage }) => ({ name, averageMastery: topicAverage })),
    classChallenges: topicAverages
      .filter(t => t.strugglingCount > 0)
      .map(t => ({ name: t.name, count: t.strugglingCount })),
    weeklyActivity,
    recentImprovement: average(improvements) || 0
  };
};

// @route   POST api/progress/attempts
// @desc    Record a completed lesson quiz for the logged-in student
// @access  Private (Students only)
exports.recordAttempt = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can record quiz attempts' });
  }

  try {
    const { topic, score, bloomsLevel } = req.body;
    const attempt = await QuizAttempt.create({ student: req.user.id, topic, score, bloomsLevel });
    await User.findByIdAndUpdate(req.user.id, { lastActive: attempt.completedAt });

    res.status(201).json(attempt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/progress/teacher-dashboard
// @desc    Class overview built from real quiz attempts (same shape as the demo data)
// @access  Private (Teachers/Admins only)
exports.getTeacherDashboard = async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Teachers only.' });
  }

  try {
    const now = new Date();
    const [teacher, students] = await Promise.all([
      User.findById(req.user.id).select('name email role classes'),
      User.find({ role: 'student' }).select('name username email class').sort({ username: 1, name: 1 })
    ]);
    const attempts = await QuizAttempt.find({ student: { $in: students.map(s => s._id) } })
      .sort({ completedAt: -1 })
      .lean();

    const attemptsByStudent = {};
    students.forEach(s => { attemptsByStudent[s._id.toString()] = []; });
    attempts.forEach(a => { attemptsByStudent[a.student.toString()].push(a); });

    // Highest risk first, then lowest mastery; students who haven't started go last
    const summaries = students
      .map(s => summariseStudent(s, attemptsByStudent[s._id.toString()], now))
      .sort((a, b) => {
        const riskA = RISK_ORDER[a.progress.riskLevel] ?? 3;
        const riskB = RISK_ORDER[b.progress.riskLevel] ?? 3;
        if (riskA !== riskB) return riskA - riskB;
        return (a.progress.overallMastery ?? 101) - (b.progress.overallMastery ?? 101);
      });

    res.json({
      instructor: teacher && {
        id: teacher._id.toString(),
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        classGroups: teacher.classes
      },
      classStats: summariseClass(summaries, attemptsByStudent, now),
      courseStats: [],
      students: summaries
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
