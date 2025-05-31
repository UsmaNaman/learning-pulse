import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  LinearProgress, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

import StudentSkillProgress from '../components/StudentSkillProgress';
import ProgressSummaryCard from '../components/ProgressSummaryCard';
import RecentActivityList from '../components/RecentActivityList';

const StudentReport = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // Messaging state
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState('normal');

  useEffect(() => {
    const fetchStudentReport = async () => {
      try {
        setLoading(true);
        
        // Fetch student dashboard data
        const response = await axios.get(`http://localhost:5000/api/mock/dashboard/${studentId}`);
        setStudentData(response.data);
        
        // Simulate fetching student activities (would come from API)
        setActivities([
          { 
            id: 1, 
            type: 'assessment', 
            title: 'Binary Numbers Quiz', 
            date: '2023-05-15', 
            score: 85,
            topic: 'Data Representation'
          },
          { 
            id: 2, 
            type: 'lesson', 
            title: 'Algorithms and Flowcharts', 
            date: '2023-05-12', 
            completion: 100,
            topic: 'Algorithms'
          },
          { 
            id: 3, 
            type: 'exercise', 
            title: 'Programming Constructs Practice', 
            date: '2023-05-10', 
            score: 70,
            topic: 'Programming Concepts'
          },
          { 
            id: 4, 
            type: 'assessment', 
            title: 'Computer Systems Test', 
            date: '2023-05-05', 
            score: 62,
            topic: 'Systems Architecture'
          },
          { 
            id: 5, 
            type: 'lesson', 
            title: 'Boolean Logic', 
            date: '2023-05-01', 
            completion: 100,
            topic: 'Data Representation'
          },
        ]);
        
        // Simulate recommendations based on student performance
        setRecommendations([
          {
            id: 1,
            topic: 'Systems Architecture',
            resource: 'Computer Components Interactive Guide',
            type: 'learning',
            priority: 'high',
            reason: 'Below average performance in recent assessment'
          },
          {
            id: 2,
            topic: 'Boolean Logic',
            resource: 'Truth Tables Practice Exercises',
            type: 'practice',
            priority: 'medium',
            reason: 'Needs reinforcement based on quiz results'
          },
          {
            id: 3,
            topic: 'Programming Concepts',
            resource: 'Python Loops Practice Challenge',
            type: 'practice',
            priority: 'medium',
            reason: 'Good foundation but needs more practice'
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching student report:', err);
        setError('Failed to load student report. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentReport();
  }, [studentId]);
  
  // Messaging functions
  const handleMessageStudent = () => {
    setMessageModalOpen(true);
  };
  
  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
    setMessageSubject('');
    setMessageContent('');
    setMessagePriority('normal');
  };
  
  const handleSendMessage = () => {
    // TODO: Implement API call to send message
    console.log('Sending message:', {
      to: { id: studentId, name: studentData?.studentName },
      subject: messageSubject,
      content: messageContent,
      priority: messagePriority
    });
    
    // For now, just show an alert
    alert(`Message sent to ${studentData?.studentName}:\n\nSubject: ${messageSubject}\nContent: ${messageContent}`);
    
    handleCloseMessageModal();
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading student report...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
          <Typography color="error">{error}</Typography>
          <Button 
            component={Link} 
            to="/dashboard" 
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!studentData) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No data found for this student.</Typography>
          <Button 
            component={Link} 
            to="/dashboard" 
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }
  
  // Calculate the number of topics at each mastery level
  const masteryLevels = {
    beginner: 0,
    developing: 0,
    proficient: 0,
    advanced: 0,
    expert: 0
  };
  
  studentData.skills?.forEach(skill => {
    if (skill.mastery < 20) masteryLevels.beginner++;
    else if (skill.mastery < 40) masteryLevels.developing++;
    else if (skill.mastery < 60) masteryLevels.proficient++;
    else if (skill.mastery < 80) masteryLevels.advanced++;
    else masteryLevels.expert++;
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          component={Link} 
          to="/dashboard" 
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Typography variant="h6" component="div">
          Student Report
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AutoGraphIcon />}
        >
          Export Report
        </Button>
      </Box>
      
      {/* Student Info Card */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {studentData.studentName?.charAt(0) || <PersonIcon />}
              </Box>
              <Box>
                <Typography variant="h5">{studentData.studentName || 'Student'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Year Group: {studentData.yearGroup || 'KS4'} | 
                  Class: {studentData.className || 'Computer Science'} | 
                  Student ID: {studentId}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
              <Typography variant="body2" color="text.secondary">Overall Progress</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={studentData.overallProgress || 0}
                    size={50}
                    thickness={5}
                    sx={{ 
                      color: (studentData.overallProgress || 0) >= 70 ? 'success.main' : 
                             (studentData.overallProgress || 0) >= 40 ? 'warning.main' : 'error.main'
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" fontWeight="bold">
                      {`${Math.round(studentData.overallProgress || 0)}%`}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {studentData.overallProgress >= 80 ? 'Excellent' :
                   studentData.overallProgress >= 60 ? 'Good' :
                   studentData.overallProgress >= 40 ? 'Satisfactory' : 'Needs Improvement'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Main content grid */}
      <Grid container spacing={4}>
        {/* Left column */}
        <Grid item xs={12} lg={8}>
          {/* Skills Progress Section */}
          <StudentSkillProgress 
            skills={studentData.skills || []} 
            title="OCR J277 Topic Progress"
          />
          
          {/* Recent Activities Section */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell align="right">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 1, 
                            color: activity.type === 'assessment' ? 'primary.main' : 
                                   activity.type === 'lesson' ? 'success.main' : 'info.main'
                          }} 
                        />
                        {activity.title}
                      </Box>
                    </TableCell>
                    <TableCell>{activity.topic}</TableCell>
                    <TableCell align="right">
                      {activity.score !== undefined ? (
                        <Chip 
                          label={`${activity.score}%`}
                          size="small"
                          color={activity.score >= 70 ? 'success' : 
                                activity.score >= 50 ? 'warning' : 'error'}
                        />
                      ) : (
                        <Chip 
                          label={`${activity.completion}% Complete`}
                          size="small"
                          color="primary"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          
          {/* Mastery Distribution */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Mastery Level Distribution</Typography>
            <Grid container spacing={2}>
              {Object.entries(masteryLevels).map(([level, count]) => (
                <Grid item xs={6} md={2.4} key={level}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {level}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      topics
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Right column */}
        <Grid item xs={12} lg={4}>
          {/* Progress Summary Card */}
          <ProgressSummaryCard
            overallProgress={studentData.overallProgress}
            strengths={studentData.insights?.strengths}
            weaknesses={studentData.insights?.areasForImprovement}
            studentName={studentData.studentName}
          />
          
          {/* Personalized Recommendations */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Personalized Recommendations</Typography>
            <List>
              {recommendations.map((rec) => (
                <Box key={rec.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      {rec.topic}
                    </Typography>
                    <Chip 
                      label={rec.priority} 
                      size="small"
                      color={rec.priority === 'high' ? 'error' : 
                             rec.priority === 'medium' ? 'warning' : 'info'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>{rec.resource}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {rec.reason}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={rec.type === 'learning' ? 'Learning Resource' : 'Practice Exercise'} 
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Box>
              ))}
            </List>
          </Paper>
          
          {/* Recent Activity */}
          <RecentActivityList 
            activities={studentData.recentActivity || []} 
            title="Student Activity Log"
          />
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          component={Link} 
          to="/dashboard" 
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        
        <Box>
          <Button 
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Add Note
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<MessageIcon />}
            onClick={handleMessageStudent}
          >
            Message Student
          </Button>
        </Box>
      </Box>
      
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
            Message Student: {studentData?.studentName}
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
              📧 This message will be sent to: {studentData?.studentName} (Student ID: {studentId})
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
    </Container>
  );
};

export default StudentReport;