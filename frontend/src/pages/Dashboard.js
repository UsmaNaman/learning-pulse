import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { courseService, progressService } from '../services';
import { 
  Box, Typography, Grid, Card, CardContent, LinearProgress, Paper, Tabs, Tab, 
  Divider, List, ListItem, ListItemText, ListItemIcon, Chip, Avatar, Button,
  Collapse, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// Import our custom components
import StudentSkillProgress from '../components/StudentSkillProgress';
import ProgressSummaryCard from '../components/ProgressSummaryCard';
import RecentActivityList from '../components/RecentActivityList';
import MotivationalElements from '../components/MotivationalElements';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check URL to determine which student data to fetch
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('student');
        const viewType = urlParams.get('view');
        
        // Fetch the appropriate dashboard data based on view type or URL params
        if (viewType === 'student' || studentId) {
          try {
            // Use the current user's name (first name) if available, or specified student ID
            const effectiveStudentId = studentId || (currentUser?.name ? currentUser.name.toLowerCase().split(' ')[0] : 'john');
            const mockResponse = await axios.get(`http://localhost:5000/api/mock/dashboard/${effectiveStudentId}`);
            setDashboardStats(mockResponse.data);
            console.log(`Directly fetched mock student data for ${effectiveStudentId}:`, mockResponse.data);
            
            // If instructor is viewing a student, also fetch student analytics
            if (currentUser?.role === 'instructor' && studentId) {
              try {
                const analyticsResponse = await axios.get(`http://localhost:5000/api/analytics/user/${studentId}/timeline?timeframe=30`, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setDashboardStats(prev => ({
                  ...prev,
                  analytics: analyticsResponse.data,
                  isInstructorView: true,
                  viewingStudentId: studentId
                }));
              } catch (analyticsError) {
                console.warn('Could not fetch student analytics:', analyticsError);
              }
            }
          } catch (mockError) {
            console.warn(`Could not fetch mock dashboard data for ${studentId}`, mockError);
          }
        } else if (viewType === 'instructor' || currentUser?.role === 'instructor') {
          try {
            const instructorResponse = await axios.get('http://localhost:5000/api/mock/instructor-dashboard');
            setStudents(instructorResponse.data.students);
            setDashboardStats({
              ...instructorResponse.data.classStats,
              instructorInfo: instructorResponse.data.instructor
            });
            setCourses(instructorResponse.data.courseStats);
            console.log('Directly fetched mock instructor data');
          } catch (mockError) {
            console.warn('Could not fetch mock instructor dashboard data', mockError);
          }
        }
        
        console.log('Current user in dashboard:', currentUser);
        console.log('User role:', currentUser?.role);
        
        // Common data for all users
        try {
          const coursesRes = await courseService.getAllCourses();
          setCourses(coursesRes.data);
        } catch (error) {
          console.warn('Could not fetch courses', error);
          // Use dummy data for demo
          setCourses([
            { _id: '1', title: 'Algorithms', description: 'Understanding and creating algorithms, flowcharts, pseudocode' },
            { _id: '2', title: 'Programming Constructs', description: 'Sequence, selection, iteration, variables' },
            { _id: '3', title: 'Data Representation', description: 'Binary, units, text/image representation' }
          ]);
        }

        // Student-specific data
        if (currentUser?.role === 'student') {
          try {
            const progressRes = await progressService.getUserProgress();
            setUserProgress(progressRes.data);
          } catch (error) {
            console.warn('Could not fetch user progress', error);
          }

          // If we didn't already fetch student data above, try to fetch it now
          if (!dashboardStats) {
            try {
              // Get the student ID from URL or use current user's ID or default to 'john'
              const urlParams = new URLSearchParams(window.location.search);
              const studentId = urlParams.get('student') || currentUser?.id || currentUser?.name?.toLowerCase().split(' ')[0] || 'john';
              
              // Fetch from our mock API endpoint with the student ID
              const mockResponse = await axios.get(`http://localhost:5000/api/mock/dashboard/${studentId}`);
              setDashboardStats(mockResponse.data);
              console.log(`Fetched mock student data for ${studentId}:`, mockResponse.data);
            } catch (error) {
              console.warn('Could not fetch mock dashboard data', error);
              
              // Fallback to old stats format for demo
              try {
                const statsRes = await progressService.getDashboardStats();
                setDashboardStats(statsRes.data);
              } catch (fallbackError) {
                console.warn('Could not fetch dashboard stats', fallbackError);
                // Use dummy stats for demo
                setDashboardStats({
                  stats: {
                    skillLevel: 'Intermediate',
                    totalPoints: 750,
                    activitiesCompleted: 12,
                    currentStreak: 3,
                    strengths: ['Algorithms', 'Python Basics'],
                    strugglingTopics: ['Binary Number System', 'Boolean Logic']
                  },
                  recentActivity: []
                });
              }
            }
          }
        }
        
        // Teacher-specific data
        if (currentUser?.role === 'instructor' || currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
          try {
            // Try to fetch from our new instructor dashboard API
            try {
              const instructorDashRes = await axios.get('http://localhost:5000/api/mock/instructor-dashboard');
              console.log('Fetched instructor dashboard data:', instructorDashRes.data);
              setStudents(instructorDashRes.data.students);
              setDashboardStats({
                ...instructorDashRes.data.classStats,
                instructorInfo: instructorDashRes.data.instructor
              });
              setCourses(instructorDashRes.data.courseStats);
            } catch (instructorError) {
              console.warn('Could not fetch instructor dashboard', instructorError);
              
              // Fall back to regular class overview
              try {
                const classOverviewRes = await progressService.getClassOverview();
                setStudents(classOverviewRes.data.students);
                setDashboardStats(classOverviewRes.data.classStats);
              } catch (classError) {
                console.warn('Could not fetch class overview', classError);
                // Use dummy data for demo
                setStudents([
                  {
                    student: { id: '1', name: 'John Smith', email: 'john.s@school.edu' },
                    progress: { skillLevel: 'Developing', totalPoints: 520, activitiesCompleted: 15, pathsInProgress: 2, pathsCompleted: 1 }
                  },
                  {
                    student: { id: '2', name: 'Emily Jones', email: 'emily.j@school.edu' },
                    progress: { skillLevel: 'Advanced', totalPoints: 890, activitiesCompleted: 28, pathsInProgress: 1, pathsCompleted: 2 }
                  }
                ]);
                
                setDashboardStats({
                  totalStudents: 5,
                  averagePoints: 650,
                  skillLevelDistribution: {
                    beginner: 1,
                    intermediate: 2,
                    advanced: 1,
                    expert: 1
                  },
                  activeStudentsLast7Days: 4
                });
              }
            }
          } catch (error) {
            console.error('Error fetching instructor data:', error);
          }
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch data regardless of user state
    fetchData();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <Box p={4}><Typography>Loading dashboard...</Typography></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;

  // Check if we're viewing a student dashboard
  // If the URL contains 'student=' parameter OR view=student, show student dashboard
  const urlParams = new URLSearchParams(window.location.search);
  const hasStudentParam = urlParams.get('student') !== null;
  const isExplicitStudentView = urlParams.get('view') === 'student';
  const isInstructorViewingStudent = hasStudentParam && currentUser?.role === 'instructor';
  const isActualStudent = currentUser?.role === 'student';
  
  // Show student dashboard if:
  // 1. URL has student parameter (instructor viewing student)
  // 2. URL explicitly says view=student 
  // 3. Current user is actually a student
  const shouldShowStudentDashboard = hasStudentParam || isExplicitStudentView || isActualStudent;
  
  // For debugging
  console.log('Dashboard decision logic:', {
    currentUserRole: currentUser?.role,
    urlParams: Object.fromEntries(urlParams.entries()),
    hasStudentParam,
    isExplicitStudentView,
    isInstructorViewingStudent,
    isActualStudent,
    shouldShowStudentDashboard,
    dashboardStats: dashboardStats
  });
  
  const studentId = urlParams.get('student') || currentUser?.id || currentUser?.name?.toLowerCase().split(' ')[0] || 'john';
                            
  // Return the appropriate dashboard
  if (shouldShowStudentDashboard) {
    return <StudentDashboard 
      currentUser={currentUser || {name: dashboardStats?.studentName || "Student", role: "student"}} 
      courses={courses} 
      userProgress={userProgress} 
      dashboardStats={dashboardStats} 
    />;
  } else {
    // Default to teacher dashboard
    return <TeacherDashboard 
      currentUser={currentUser || {name: "Usman Akram", role: "instructor"}}
      courses={courses} 
      students={students} 
      dashboardStats={dashboardStats}
      tabValue={tabValue}
      handleTabChange={handleTabChange} 
    />;
  }
};

// Student Dashboard Component
const StudentDashboard = ({ currentUser, courses, userProgress, dashboardStats }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isInstructorView = dashboardStats?.isInstructorView || (currentUser?.role === 'instructor' && urlParams.get('student'));
  const viewingStudentId = dashboardStats?.viewingStudentId || urlParams.get('student');
  
  // Debug logging
  console.log('StudentDashboard render:', {
    currentUserRole: currentUser?.role,
    isInstructorView,
    viewingStudentId,
    studentName: dashboardStats?.studentName
  });
  const calculateProgress = (courseId, progress) => {
    if (!progress || !progress.courses) return 0;
    
    const courseProgress = progress.courses.find(c => c.course === courseId);
    if (!courseProgress) return 0;
    
    return Math.round((courseProgress.completedLessons / courseProgress.totalLessons) * 100);
  };

  return (
    <Box p={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isInstructorView ? 
            `Student Analytics: ${dashboardStats?.studentName || "Student"}` :
            `Welcome, ${dashboardStats?.studentName || currentUser?.name || "Student"}`
          }
        </Typography>

        <Box>
          {isInstructorView ? (
            <Button 
              component={Link} 
              to="/dashboard?view=instructor" 
              variant="outlined" 
              color="primary"
              startIcon={<KeyboardBackspaceIcon />}
              sx={{ mr: 2 }}
            >
              Back to Class Overview
            </Button>
          ) : null}
          
          <Button 
            component={Link} 
            to="/student-selector" 
            variant="outlined" 
            color="primary"
            startIcon={<PeopleAltIcon />}
            sx={{ ml: 2 }}
          >
            {isInstructorView ? 'View Another Student' : 'Switch Student'}
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
          Currently viewing dashboard for: <strong style={{ marginLeft: '4px' }}>{dashboardStats?.studentName || currentUser?.name || "Student"}</strong>
        </Typography>
      </Box>
      
      {/* Top stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Overall Progress</Typography>
              <Typography variant="h4">
                {dashboardStats?.overallProgress || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Last Quiz Score</Typography>
              <Typography variant="h4">
                {(() => {
                  const quizzes = dashboardStats?.recentActivity?.filter(activity => 
                    activity.type === 'assessment') || [];
                  const lastQuiz = quizzes.length > 0 ? quizzes[0] : null;
                  return lastQuiz ? `${lastQuiz.score}%` : 'N/A';
                })()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(() => {
                  const quizzes = dashboardStats?.recentActivity?.filter(activity => 
                    activity.type === 'assessment') || [];
                  const lastQuiz = quizzes.length > 0 ? quizzes[0] : null;
                  return lastQuiz ? lastQuiz.title : 'No quizzes taken';
                })()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Quiz Average</Typography>
              <Typography variant="h4">
                {(() => {
                  const quizzes = dashboardStats?.recentActivity?.filter(activity => 
                    activity.type === 'assessment') || [];
                  if (quizzes.length === 0) return 'N/A';
                  const average = quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length;
                  return `${Math.round(average)}%`;
                })()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(() => {
                  const quizzes = dashboardStats?.recentActivity?.filter(activity => 
                    activity.type === 'assessment') || [];
                  return `${quizzes.length} quiz${quizzes.length !== 1 ? 'es' : ''} taken`;
                })()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Activities</Typography>
              <Typography variant="h4">
                {dashboardStats?.insights?.activityCount || dashboardStats?.recentActivity?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Last Active</Typography>
              <Typography variant="body1">
                {dashboardStats?.insights?.lastActive ? 
                  new Date(dashboardStats.insights.lastActive).toLocaleDateString() : 
                  'Never'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* OCR J277 Skills Progress and Analytics */}
      <Grid container spacing={3}>
        {/* Left column - Skill Progress */}
        <Grid item xs={12} md={7}>
          {/* New StudentSkillProgress component to show skill mastery levels */}
          <StudentSkillProgress 
            skills={dashboardStats?.skills || []} 
            title="OCR J277 Topic Progress"
          />
        </Grid>
        
        {/* Right column - Summary and Recent Activity */}
        <Grid item xs={12} md={5}>
          {/* Progress Summary Card */}
          <ProgressSummaryCard
            overallProgress={dashboardStats?.overallProgress}
            strengths={dashboardStats?.insights?.strengths}
            weaknesses={dashboardStats?.insights?.areasForImprovement}
            studentName={dashboardStats?.studentName}
            skills={dashboardStats?.skills || []}
          />
          
          {/* Recent Activity List */}
          <RecentActivityList 
            activities={dashboardStats?.recentActivity || []} 
          />
        </Grid>
      </Grid>
      
      {/* Motivational Elements Section */}
      {!isInstructorView && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Your Achievements
          </Typography>
          <MotivationalElements 
            studentProgress={dashboardStats?.insights || {}}
            recentActivities={dashboardStats?.recentActivity || []}
            overallProgress={dashboardStats?.overallProgress || 0}
            awardedBadges={dashboardStats?.badges || []}
          />
        </>
      )}

      {/* Instructor Analytics Section */}
      {isInstructorView && dashboardStats?.analytics && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            🔍 Instructor Analytics
          </Typography>
          
          <Grid container spacing={3}>
            {/* Activity Timeline */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity Timeline
                </Typography>
                
                {dashboardStats.analytics.interactions?.slice(0, 10).map((interaction, index) => (
                  <Box key={index} sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {interaction.interactionType.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(interaction.timestamp).toLocaleDateString()} at {new Date(interaction.timestamp).toLocaleTimeString()}
                    </Typography>
                    {interaction.metadata?.topicId && (
                      <Chip 
                        label={interaction.metadata.topicId}
                        size="small"
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                )) || (
                  <Typography color="text.secondary">No recent activity data available</Typography>
                )}
              </Paper>
            </Grid>

            {/* Engagement Metrics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Engagement Metrics (Last 30 Days)
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Total Interactions: <strong>{dashboardStats.analytics.totalCount || 0}</strong>
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Time Period: <strong>{dashboardStats.analytics.timeframe || 30} days</strong>
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Most Active Day: <strong>
                      {dashboardStats.analytics.interactions?.length > 0 ? 
                        new Date(dashboardStats.analytics.interactions[0].timestamp).toLocaleDateString() : 
                        'No data'
                      }
                    </strong>
                  </Typography>
                </Box>

                {/* Interaction Types Breakdown */}
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Activity Breakdown:
                </Typography>
                {(() => {
                  const interactionTypes = {};
                  dashboardStats.analytics.interactions?.forEach(interaction => {
                    const type = interaction.interactionType;
                    interactionTypes[type] = (interactionTypes[type] || 0) + 1;
                  });
                  
                  return Object.entries(interactionTypes).map(([type, count]) => (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{type.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2" fontWeight="bold">{count}</Typography>
                    </Box>
                  ));
                })()}
              </Paper>
            </Grid>

            {/* Learning Patterns */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Learning Patterns & Insights
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Peak Activity:</strong> Based on timestamps, this student is most active during regular school hours.
                      </Typography>
                    </Alert>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Alert severity={dashboardStats.overallProgress >= 70 ? "success" : "warning"}>
                      <Typography variant="body2">
                        <strong>Progress Rate:</strong> {dashboardStats.overallProgress >= 70 ? "Above average" : "Needs attention"} - {dashboardStats.overallProgress}% overall mastery
                      </Typography>
                    </Alert>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Engagement Level:</strong> {dashboardStats.analytics.totalCount > 50 ? "High" : dashboardStats.analytics.totalCount > 20 ? "Medium" : "Low"} - {dashboardStats.analytics.totalCount} interactions in {dashboardStats.analytics.timeframe} days
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
                
                {/* Recommendations */}
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                  📝 Instructor Recommendations:
                </Typography>
                <List dense>
                  {dashboardStats.overallProgress < 50 && (
                    <ListItem>
                      <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                      <ListItemText primary="Consider scheduling a one-on-one session to address learning gaps" />
                    </ListItem>
                  )}
                  {dashboardStats.analytics.totalCount < 10 && (
                    <ListItem>
                      <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                      <ListItemText primary="Low engagement detected - try gamification or different learning materials" />
                    </ListItem>
                  )}
                  {dashboardStats.overallProgress >= 80 && (
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Excellent progress! Consider providing advanced challenges" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
      
      {/* Enrolled Courses Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Your Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={calculateProgress(course._id, userProgress)} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {calculateProgress(course._id, userProgress)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>You are not enrolled in any courses yet.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

// Teacher Dashboard Component
const TeacherDashboard = ({ currentUser, courses, students, dashboardStats, tabValue, handleTabChange }) => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard: {dashboardStats?.instructorInfo?.name || currentUser.name}
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Students</Typography>
              <Typography variant="h4">
                {dashboardStats?.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Average Points</Typography>
              <Typography variant="h4">
                {dashboardStats?.averagePoints?.toFixed(0) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Courses</Typography>
              <Typography variant="h4">
                {courses?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Active Students</Typography>
              <Typography variant="h4">
                {dashboardStats?.activeStudentsLast7Days || 0}
              </Typography>
              <Typography variant="caption">Last 7 days</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Student Progress" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Course Overview" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Performance Analytics" icon={<TrendingUpIcon />} iconPosition="start" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {tabValue === 0 && (
        <StudentProgressTab students={students} />
      )}
      
      {tabValue === 1 && (
        <CourseOverviewTab courses={courses} />
      )}
      
      {tabValue === 2 && (
        <PerformanceAnalyticsTab dashboardStats={dashboardStats} />
      )}
    </Box>
  );
};

// Student Progress Tab
const StudentProgressTab = ({ students }) => {
  // State to track expanded student cards
  const [expandedStudent, setExpandedStudent] = useState(null);
  // State for messaging modal
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState('normal');
  
  // Function to toggle expansion
  const handleExpandClick = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };
  
  // Function to handle messaging a student
  const handleMessageStudent = (student) => {
    setSelectedStudent(student);
    setMessageModalOpen(true);
  };
  
  // Function to handle closing the message modal
  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
    setSelectedStudent(null);
    setMessageSubject('');
    setMessageContent('');
    setMessagePriority('normal');
  };
  
  // Function to send the message
  const handleSendMessage = () => {
    // TODO: Implement API call to send message
    console.log('Sending message:', {
      to: selectedStudent,
      subject: messageSubject,
      content: messageContent,
      priority: messagePriority
    });
    
    // For now, just show an alert
    alert(`Message sent to ${selectedStudent.name}:\n\nSubject: ${messageSubject}\nContent: ${messageContent}`);
    
    handleCloseMessageModal();
  };
  
  // Function to get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch(riskLevel) {
      case 'high': return '#f44336'; // Red
      case 'medium': return '#ff9800'; // Amber
      case 'low': return '#4caf50'; // Green
      default: return '#2196f3'; // Blue
    }
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Student Progress Tracker
      </Typography>
      
      {students?.length > 0 ? (
        <Grid container spacing={3}>
          {students.map((studentData, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ mb: 1 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {studentData.student.avatar || studentData.student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{studentData.student.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {studentData.student.email}
                          </Typography>
                          {studentData.student.group && (
                            <Chip 
                              label={studentData.student.group} 
                              size="small" 
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">Skill Level</Typography>
                      <Chip 
                        label={studentData.progress.skillLevel || 'Beginner'}
                        color="primary" 
                        size="small" 
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                    
                    <Grid item xs={6} sm={1}>
                      <Typography variant="body2" color="text.secondary">Mastery</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {studentData.progress.overallMastery || '0'}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={1}>
                      <Typography variant="body2" color="text.secondary">Points</Typography>
                      <Typography variant="body1">{studentData.progress.totalPoints || 0}</Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={1}>
                      <Typography variant="body2" color="text.secondary">Activities</Typography>
                      <Typography variant="body1">{studentData.progress.activitiesCompleted || 0}</Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">Weekly Streak</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {studentData.progress.weeklyStreak || 0} days
                        </Typography>
                        {studentData.progress.weeklyStreak > 0 && (
                          <EmojiEventsIcon 
                            fontSize="small" 
                            sx={{ color: studentData.progress.weeklyStreak >= 5 ? '#FFD700' : '#C0C0C0' }} 
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">Risk Level</Typography>
                      <Chip 
                        label={studentData.progress.riskLevel ? 
                          studentData.progress.riskLevel.charAt(0).toUpperCase() + 
                          studentData.progress.riskLevel.slice(1) : 
                          'Unknown'
                        }
                        sx={{ 
                          bgcolor: getRiskLevelColor(studentData.progress.riskLevel),
                          color: 'white',
                          fontWeight: 'bold',
                          mt: 0.5
                        }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => handleExpandClick(studentData.student.id)}
                      endIcon={expandedStudent === studentData.student.id ? 
                        <KeyboardArrowUpIcon /> : 
                        <KeyboardArrowDownIcon />
                      }
                    >
                      {expandedStudent === studentData.student.id ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </Box>
                  
                  <Collapse in={expandedStudent === studentData.student.id} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={3}>
                      {/* Strengths & Weaknesses */}
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Strengths
                          </Typography>
                          {studentData.progress.strengths && studentData.progress.strengths.length > 0 ? (
                            <List dense disablePadding>
                              {studentData.progress.strengths.map((strength, idx) => (
                                <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <TrendingUpIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={strength} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No strengths identified yet
                            </Typography>
                          )}
                          
                          <Typography variant="subtitle2" color="error" gutterBottom sx={{ mt: 2 }}>
                            Areas for Improvement
                          </Typography>
                          {studentData.progress.weaknesses && studentData.progress.weaknesses.length > 0 ? (
                            <List dense disablePadding>
                              {studentData.progress.weaknesses.map((weakness, idx) => (
                                <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <TrendingUpIcon fontSize="small" color="error" />
                                  </ListItemIcon>
                                  <ListItemText primary={weakness} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No areas for improvement identified
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                      
                      {/* Topics Mastery */}
                      <Grid item xs={12} md={8}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Topic Mastery
                          </Typography>
                          
                          {studentData.progress.topicMastery && studentData.progress.topicMastery.length > 0 ? (
                            <Grid container spacing={1}>
                              {studentData.progress.topicMastery.map((topic, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{topic.topic}</span>
                                      <strong>{topic.mastery}%</strong>
                                    </Typography>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={topic.mastery}
                                      sx={{ 
                                        height: 6, 
                                        borderRadius: 3,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                          backgroundColor: topic.mastery >= 70 ? '#4caf50' : 
                                                          topic.mastery >= 40 ? '#ff9800' : 
                                                          '#f44336'
                                        }
                                      }}
                                    />
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No topic mastery data available
                            </Typography>
                          )}
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Last active: {studentData.progress.lastActive ? 
                                new Date(studentData.progress.lastActive).toLocaleDateString() : 
                                'Unknown'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to={`/dashboard?student=${studentData.student.id}&view=student`}
                              >
                                View Dashboard
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="secondary"
                                component={Link}
                                to={`/student-report/${studentData.student.id}`}
                              >
                                Full Report
                              </Button>
                              <Button 
                                size="small" 
                                variant="contained"
                                color="info"
                                onClick={() => handleMessageStudent(studentData.student)}
                                startIcon={<MessageIcon />}
                              >
                                Message
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No student data available</Typography>
        </Paper>
      )}
      
      {/* Message Student Modal */}
      <Dialog 
        open={messageModalOpen} 
        onClose={handleCloseMessageModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MessageIcon sx={{ mr: 1 }} />
            Message Student: {selectedStudent?.name}
          </Box>
          <IconButton onClick={handleCloseMessageModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Subject"
              fullWidth
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Enter message subject..."
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={messagePriority}
                onChange={(e) => setMessagePriority(e.target.value)}
                label="Priority"
              >
                <MenuItem value="low">Low Priority</MenuItem>
                <MenuItem value="normal">Normal Priority</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Message"
              multiline
              rows={6}
              fullWidth
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              required
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📧 This message will be sent to: {selectedStudent?.email}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseMessageModal}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!messageSubject.trim() || !messageContent.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Course Overview Tab
const CourseOverviewTab = ({ courses }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Course Overview
      </Typography>
      
      {courses?.length > 0 ? (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} key={course.id || index}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description || `Comprehensive course covering key computer science concepts`}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={`${course.enrolledStudents || 0} Students`}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">
                        <strong>Progress: </strong>
                        {course.lessonsCompleted || 0}/{course.totalLessons || 0} lessons
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.averageProgress || 0}
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="body2" align="right">
                      {course.averageProgress || 0}% Average Completion
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Topic Progress</Typography>
                  <Grid container spacing={2}>
                    {course.topics ? (
                      course.topics.map((topic, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{topic.name}</span>
                              <strong>{topic.progress}%</strong>
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={topic.progress}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: topic.progress >= 70 ? '#4caf50' : 
                                                   topic.progress >= 40 ? '#ff9800' : 
                                                   '#f44336'
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No topic data available
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  {(course.topStudents || course.studentsAtRisk) && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        {course.topStudents && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="primary">Top Performing Students</Typography>
                            {course.topStudents.map((student, idx) => (
                              <Chip 
                                key={idx}
                                label={student}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ mr: 1, mt: 1 }}
                              />
                            ))}
                          </Grid>
                        )}
                        {course.studentsAtRisk && course.studentsAtRisk.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="error">Students Needing Support</Typography>
                            {course.studentsAtRisk.map((student, idx) => (
                              <Chip 
                                key={idx}
                                label={student}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ mr: 1, mt: 1 }}
                              />
                            ))}
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No courses available</Typography>
        </Paper>
      )}
    </div>
  );
};

// Performance Analytics Tab
const PerformanceAnalyticsTab = ({ dashboardStats }) => {
  // Dummy data object to use when props not available
  const analytics = window.instructorAnalytics || {};
  
  // Get the instructor dashboard analytics data from the window global
  // This will be populated by the API call in the useEffect
  useEffect(() => {
    // Try to fetch instructor analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/mock/instructor-dashboard');
        if (response.data && response.data.analytics) {
          window.instructorAnalytics = response.data.analytics;
          // Force a re-render
          setForceUpdate(prev => !prev);
        }
      } catch (error) {
        console.warn('Could not fetch analytics data', error);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  // State to force re-render when data is fetched
  const [forceUpdate, setForceUpdate] = useState(false);
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Class Performance Analytics
      </Typography>
      
      {/* Top Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Average Mastery</Typography>
              <Typography variant="h4">
                {dashboardStats?.averageMastery || 0}%
              </Typography>
              <Typography variant="caption" color="success.main">
                +{analytics?.activityTrends?.improvedTopics || 0} improved topics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Weekly Activities</Typography>
              <Typography variant="h4">
                {dashboardStats?.activitiesPerWeek?.toFixed(1) || 0}
              </Typography>
              <Typography variant="caption">
                per student average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">At Risk Students</Typography>
              <Typography variant="h4">
                {dashboardStats?.atRiskStudents || 0}
              </Typography>
              <Typography variant="caption" color="error.main">
                Require intervention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Recent Improvement</Typography>
              <Typography variant="h4">
                {dashboardStats?.recentImprovement || 0}%
              </Typography>
              <Typography variant="caption">
                Last 2 weeks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Topic Performance Trends */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Topic Performance Trends</Typography>
              
              {analytics?.topicPerformance ? (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Topic</TableCell>
                        <TableCell align="right">Current</TableCell>
                        <TableCell align="right">Previous</TableCell>
                        <TableCell align="right">Change</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.topicPerformance.map((topic, index) => (
                        <TableRow key={index}>
                          <TableCell>{topic.topic}</TableCell>
                          <TableCell align="right">{topic.currentAvg}%</TableCell>
                          <TableCell align="right">{topic.previousAvg}%</TableCell>
                          <TableCell 
                            align="right"
                            sx={{ 
                              color: topic.change.startsWith('+') ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {topic.change}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Typography color="text.secondary">No topic performance data available</Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label={`${analytics?.activityTrends?.improvedTopics || 0} Improved Topics`}
                  color="success"
                  size="small"
                />
                
                <Chip 
                  icon={<TrendingUpIcon sx={{ transform: 'rotate(180deg)' }} />} 
                  label={`${analytics?.activityTrends?.decliningTopics || 0} Declining Topics`}
                  color="error"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column - Skill Distribution and Weekly Activity */}
        <Grid item xs={12} md={5}>
          {/* Skill Level Distribution */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Skill Level Distribution</Typography>
              <List dense disablePadding>
                <ListItem>
                  <ListItemIcon><EmojiEventsIcon style={{ color: '#4caf50' }} /></ListItemIcon>
                  <ListItemText 
                    primary="Beginner" 
                    secondary={`${dashboardStats?.skillLevelDistribution?.beginner || 0} students`} 
                  />
                  <Box sx={{ width: '40%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats?.skillLevelDistribution?.beginner / dashboardStats?.totalStudents) * 100 || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e8f5e9', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmojiEventsIcon style={{ color: '#2196f3' }} /></ListItemIcon>
                  <ListItemText 
                    primary="Intermediate" 
                    secondary={`${dashboardStats?.skillLevelDistribution?.intermediate || 0} students`} 
                  />
                  <Box sx={{ width: '40%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats?.skillLevelDistribution?.intermediate / dashboardStats?.totalStudents) * 100 || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e3f2fd', '& .MuiLinearProgress-bar': { bgcolor: '#2196f3' } }}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmojiEventsIcon style={{ color: '#f44336' }} /></ListItemIcon>
                  <ListItemText 
                    primary="Advanced" 
                    secondary={`${dashboardStats?.skillLevelDistribution?.advanced || 0} students`} 
                  />
                  <Box sx={{ width: '40%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats?.skillLevelDistribution?.advanced / dashboardStats?.totalStudents) * 100 || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#ffebee', '& .MuiLinearProgress-bar': { bgcolor: '#f44336' } }}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmojiEventsIcon style={{ color: '#9c27b0' }} /></ListItemIcon>
                  <ListItemText 
                    primary="Expert" 
                    secondary={`${dashboardStats?.skillLevelDistribution?.expert || 0} students`} 
                  />
                  <Box sx={{ width: '40%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats?.skillLevelDistribution?.expert / dashboardStats?.totalStudents) * 100 || 0}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#f3e5f5', '& .MuiLinearProgress-bar': { bgcolor: '#9c27b0' } }}
                    />
                  </Box>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {/* Weekly Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Weekly Activity Pattern</Typography>
              
              {dashboardStats?.weeklyActivity ? (
                <Box sx={{ px: 1 }}>
                  {dashboardStats.weeklyActivity.map((day, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ width: 100 }}>{day.day}</Typography>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={day.count * 5} // Scale for visualization
                          sx={{ 
                            height: 12, 
                            borderRadius: 6,
                            bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': { 
                              bgcolor: day.count > 10 ? '#4caf50' : '#2196f3' 
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2">{day.count}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No weekly activity data available</Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Activities tracked over {analytics?.activityTrends?.weeksActive || 0} weeks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Bottom Row - Interventions and Positive Outliers */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Interventions Needed */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="error" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1 }} /> Students Needing Intervention
                  </Typography>
                  
                  {analytics?.interventionNeeded && analytics.interventionNeeded.length > 0 ? (
                    <List>
                      {analytics.interventionNeeded.map((intervention, idx) => (
                        <ListItem key={idx} sx={{ bgcolor: '#ffebee', borderRadius: 1, mb: 1 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: '#f44336' }}>
                              {intervention.student.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={intervention.student}
                            secondary={intervention.reason}
                          />
                          <Tooltip title={intervention.suggestedAction}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No students currently need intervention</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Positive Outliers */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ mr: 1 }} /> Outstanding Performance
                  </Typography>
                  
                  {analytics?.positiveOutliers && analytics.positiveOutliers.length > 0 ? (
                    <List>
                      {analytics.positiveOutliers.map((outlier, idx) => (
                        <ListItem key={idx} sx={{ bgcolor: '#e8f5e9', borderRadius: 1, mb: 1 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                              {outlier.student.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={outlier.student}
                            secondary={outlier.achievement}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No outstanding performances to display</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;