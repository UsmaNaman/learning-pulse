import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

const MotivationalElements = ({ 
  studentProgress = {},
  recentActivities = [],
  overallProgress = 0,
  awardedBadges = [] 
}) => {
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Calculate streaks and achievements
  const calculateStreaks = () => {
    const today = new Date();
    const activeDays = [];
    
    // Check last 30 days for activity
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivity = recentActivities.some(activity => {
        const activityDate = new Date(activity.completedAt);
        return activityDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasActivity) {
        activeDays.push(checkDate);
      } else if (i === 0) {
        // If no activity today, break the current streak
        break;
      }
    }
    
    return {
      currentStreak: activeDays.length,
      longestStreak: Math.max(activeDays.length, studentProgress.longestStreak || 0),
      activeDaysThisWeek: activeDays.filter(date => {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return date >= weekAgo;
      }).length
    };
  };

  const streaks = calculateStreaks();

  // Define available badges
  const badges = [
    {
      id: 'first_login',
      title: 'Welcome Aboard!',
      description: 'Completed your first login',
      icon: '🎉',
      color: '#2196f3',
      requirement: 'Complete first login',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Active for 7 consecutive days',
      icon: '⚡',
      color: '#ff9800',
      requirement: '7 day streak',
      earned: streaks.currentStreak >= 7,
      earnedDate: streaks.currentStreak >= 7 ? new Date().toISOString().split('T')[0] : null
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Scored 90%+ on 5 quizzes',
      icon: '🧠',
      color: '#9c27b0',
      requirement: '90%+ on 5 quizzes',
      earned: recentActivities.filter(a => a.type === 'assessment' && a.score >= 90).length >= 5,
      earnedDate: '2024-01-20'
    },
    {
      id: 'blooms_climber',
      title: "Bloom's Climber",
      description: 'Reached Analyze level in any topic',
      icon: '🏔️',
      color: '#4caf50',
      requirement: 'Reach Analyze level (70%+)',
      earned: overallProgress >= 70,
      earnedDate: overallProgress >= 70 ? new Date().toISOString().split('T')[0] : null
    },
    {
      id: 'code_ninja',
      title: 'Code Ninja',
      description: 'Completed 10 coding challenges',
      icon: '🥷',
      color: '#607d8b',
      requirement: '10 coding challenges',
      earned: recentActivities.filter(a => a.title.toLowerCase().includes('coding')).length >= 3,
      earnedDate: '2024-01-25'
    },
    {
      id: 'reflection_guru',
      title: 'Reflection Guru',
      description: 'Submitted 5 learning reflections',
      icon: '🧘',
      color: '#795548',
      requirement: '5 reflections',
      earned: recentActivities.filter(a => a.title.toLowerCase().includes('reflection')).length >= 2,
      earnedDate: null
    },
    {
      id: 'speed_learner',
      title: 'Speed Learner',
      description: 'Completed 3 activities in one day',
      icon: '💨',
      color: '#f44336',
      requirement: '3 activities in one day',
      earned: false,
      earnedDate: null
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Achieved 100% on any assessment',
      icon: '💯',
      color: '#ffc107',
      requirement: '100% on assessment',
      earned: recentActivities.some(a => a.score === 100),
      earnedDate: '2024-01-18'
    }
  ];

  // Use awarded badges from props if available, otherwise fall back to calculated badges
  const earnedBadges = awardedBadges.length > 0 ? awardedBadges : badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !earnedBadges.some(earned => earned.id === badge.id));

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setBadgeDialogOpen(true);
  };

  const handleBadgeKeyDown = (event, badge) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBadgeClick(badge);
    }
  };

  // Achievement progress calculations
  const getNextAchievement = () => {
    const nextBadge = availableBadges.find(badge => {
      // Simple logic to find closest achievement
      if (badge.id === 'week_warrior') return streaks.currentStreak < 7;
      if (badge.id === 'blooms_climber') return overallProgress < 70;
      return true;
    });
    return nextBadge;
  };

  const nextAchievement = getNextAchievement();

  return (
    <Box>
      {/* Streak Display */}
      <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {streaks.currentStreak} Day Streak! 🔥
            </Typography>
            <Typography variant="body2">
              Longest streak: {streaks.longestStreak} days • Active {streaks.activeDaysThisWeek}/7 days this week
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Progress Towards Next Achievement */}
      {nextAchievement && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎯 Next Achievement
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {nextAchievement.title}
            </Typography>
            <Chip label={nextAchievement.requirement} size="small" color="primary" />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={
              nextAchievement.id === 'week_warrior' 
                ? (streaks.currentStreak / 7) * 100
                : nextAchievement.id === 'blooms_climber'
                  ? (overallProgress / 70) * 100
                  : 30
            }
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>
      )}

      {/* Earned Badges */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🏆 Your Badges ({earnedBadges.length})
        </Typography>
        
        {earnedBadges.length === 0 ? (
          <Typography color="text.secondary">
            Complete activities to earn your first badge!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {earnedBadges.map((badge) => (
              <Grid item xs={6} sm={4} md={3} key={badge.id}>
                <Card 
                  component="button"
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    '&:focus': { 
                      outline: '2px solid #1976d2',
                      outlineOffset: '2px'
                    },
                    border: 'none',
                    background: 'inherit'
                  }}
                  onClick={() => handleBadgeClick(badge)}
                  onKeyDown={(e) => handleBadgeKeyDown(e, badge)}
                  aria-label={`${badge.title} badge. ${badge.description}. Earned on ${badge.earnedDate}.`}
                  role="button"
                  tabIndex={0}
                >
                  <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                    <Box sx={{ fontSize: '2rem', mb: 1 }}>
                      {badge.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {badge.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {badge.earnedDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Available Badges to Earn */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎯 Available Badges
        </Typography>
        
        <Grid container spacing={2}>
          {availableBadges.slice(0, 6).map((badge) => (
            <Grid item xs={6} sm={4} md={3} key={badge.id}>
              <Card 
                sx={{ 
                  opacity: 0.6,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                  <Box sx={{ fontSize: '2rem', mb: 1, filter: 'grayscale(100%)' }}>
                    {badge.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {badge.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {badge.requirement}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick Stats */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {recentActivities.length}
              </Typography>
              <Typography variant="caption">Activities</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {Math.round(recentActivities.reduce((acc, a) => acc + a.score, 0) / recentActivities.length) || 0}
              </Typography>
              <Typography variant="caption">Avg Score</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {streaks.currentStreak}
              </Typography>
              <Typography variant="caption">Day Streak</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {earnedBadges.length}
              </Typography>
              <Typography variant="caption">Badges</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Badge Detail Dialog */}
      <Dialog 
        open={badgeDialogOpen} 
        onClose={() => setBadgeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle sx={{ textAlign: 'center', position: 'relative' }}>
              <IconButton
                onClick={() => setBadgeDialogOpen(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ fontSize: '4rem', mb: 2 }}>
                  {selectedBadge.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {selectedBadge.title}
                </Typography>
                
                {selectedBadge.earned ? (
                  <Chip 
                    label={`Earned on ${selectedBadge.earnedDate}`}
                    color="success"
                    icon={<CheckCircleIcon />}
                  />
                ) : (
                  <Chip 
                    label="Not yet earned"
                    variant="outlined"
                  />
                )}
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1" paragraph>
                {selectedBadge.description}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Requirement:</strong> {selectedBadge.requirement}
              </Typography>
              
              {!selectedBadge.earned && (
                <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                  Keep working towards this goal! 💪
                </Typography>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MotivationalElements;