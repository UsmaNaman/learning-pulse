/**
 * Progress data seed script
 * Populates MongoDB with realistic student progress data
 * 
 * Usage: node seedProgress.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mockProgressData = require('./data/mockProgressData');

// Load environment variables
dotenv.config();

// Configure mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-pulse')
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import models
const { User, StudentProgress } = require('./models');

// Reference for mapping student IDs to actual MongoDB IDs
const studentIdMap = {
  'john': null,
  'ava': null,
  'david': null,
  'fatima': null,
  'liam': null
};

async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    
    // Clear existing data
    await StudentProgress.deleteMany({});
    console.log('✅ Cleared existing student progress data');
    
    // Check if we have the required users or need to create them
    for (const studentId of Object.keys(studentIdMap)) {
      const mockStudent = mockProgressData[studentId];
      
      // Look for existing user
      let user = await User.findOne({ 
        name: mockStudent.studentName 
      });
      
      // Create user if not found
      if (!user) {
        user = new User({
          name: mockStudent.studentName,
          email: `${studentId}@example.com`,
          password: '$2a$10$KRW5YNz1Vd1b4bZzRLVsOOS9uW0hbNJdDyZsZ5VylgR5oGDpRdKWG', // hashed 'password'
          role: 'student',
          registeredOn: new Date()
        });
        await user.save();
        console.log(`✅ Created user: ${user.name}`);
      }
      
      // Store the MongoDB user ID
      studentIdMap[studentId] = user._id;
    }
    
    // Create StudentProgress records
    for (const studentId of Object.keys(mockProgressData)) {
      const mockData = mockProgressData[studentId];
      const userId = studentIdMap[studentId];
      
      if (!userId) {
        console.error(`❌ Missing user ID for student: ${studentId}`);
        continue;
      }
      
      // Build the progress document
      const progressDoc = {
        student: userId,
        currentSkillLevel: getSkillLevel(mockData.overallProgress),
        totalPoints: calculatePoints(mockData.skills, mockData.recentActivity),
        
        // Create skill objects categorized as strengths/weaknesses
        learningAnalytics: {
          strengths: mockData.insights.strengths.map(name => ({
            topicName: name,
            assessmentScores: getScoresForTopic(name, mockData.recentActivity),
            avgScore: getAvgScoreForTopic(name, mockData.recentActivity)
          })),
          strugglingTopics: mockData.insights.areasForImprovement.map(name => ({
            topicName: name,
            assessmentScores: getScoresForTopic(name, mockData.recentActivity),
            avgScore: getAvgScoreForTopic(name, mockData.recentActivity),
            remedialResourcesViewed: Math.floor(Math.random() * 3) // 0-2 remedial resources
          })),
          learningPace: getLearningPace(mockData.recentActivity),
          learningPreferences: {
            preferredActivityTypes: getPreferredActivityTypes(mockData.recentActivity),
            preferredDifficulty: getSkillLevel(mockData.overallProgress).toLowerCase(),
            preferredTimeOfDay: getPreferredTimeOfDay(mockData.recentActivity)
          }
        },
        
        // Convert activity data to the expected format
        completedActivities: mockData.recentActivity
          .filter(a => a.type === 'activity')
          .map(activity => ({
            // In a real system, this would link to a real activity ID
            activity: mongoose.Types.ObjectId(),
            completedAt: activity.completedAt,
            score: activity.score,
            timeSpent: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
            attempts: Math.floor(Math.random() * 2) + 1, // 1-2 attempts
            hintsUsed: Math.floor(Math.random() * 3) // 0-2 hints
          })),
        
        // Convert assessment data to the expected format
        assessmentResults: mockData.recentActivity
          .filter(a => a.type === 'assessment')
          .map(assessment => ({
            // In a real system, this would link to a real assessment ID
            assessment: mongoose.Types.ObjectId(),
            completedAt: assessment.completedAt,
            score: assessment.score,
            timeSpent: Math.floor(Math.random() * 45) + 30, // 30-75 minutes
            responses: generateRandomResponses(assessment.score)
          })),
        
        // Add some learning goals
        learningGoals: generateLearningGoals(mockData),
        
        // Add streak data
        streak: calculateStreak(mockData.recentActivity),
        
        // Add some badges based on performance
        badges: generateBadges(mockData),
        
        // Last activity timestamp
        lastActive: mockData.recentActivity[0]?.completedAt || new Date()
      };
      
      // Create and save the progress document
      const progress = new StudentProgress(progressDoc);
      await progress.save();
      console.log(`✅ Created progress data for: ${mockData.studentName}`);
    }
    
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Helper functions

function getSkillLevel(overallProgress) {
  if (overallProgress >= 85) return 'Expert';
  if (overallProgress >= 70) return 'Advanced';
  if (overallProgress >= 50) return 'Intermediate';
  return 'Beginner';
}

function calculatePoints(skills, activities) {
  // Base points from skill mastery
  const skillPoints = skills.reduce((sum, skill) => sum + (skill.mastery * 5), 0);
  
  // Points from activities
  const activityPoints = activities.reduce((sum, activity) => {
    return sum + (activity.score * (activity.type === 'assessment' ? 2 : 1));
  }, 0);
  
  return Math.round((skillPoints + activityPoints) / 5);
}

function getScoresForTopic(topicName, activities) {
  // This is a simplification since our mock data doesn't have direct topic-to-activity mapping
  return activities
    .filter(a => a.title.includes(topicName.split(' ')[0]))
    .map(a => a.score);
}

function getAvgScoreForTopic(topicName, activities) {
  const scores = getScoresForTopic(topicName, activities);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getLearningPace(activities) {
  // Calculate average days between activities
  if (activities.length < 2) return 'average';
  
  const sortedDates = activities.map(a => new Date(a.completedAt)).sort((a, b) => a - b);
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];
  const daySpan = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
  const activitiesPerDay = activities.length / (daySpan || 1);
  
  if (activitiesPerDay > 0.8) return 'faster';
  if (activitiesPerDay < 0.4) return 'slower';
  return 'average';
}

function getPreferredActivityTypes(activities) {
  // Count activity types
  const activityCount = activities.filter(a => a.type === 'activity').length;
  const assessmentCount = activities.filter(a => a.type === 'assessment').length;
  
  // Determine preferences (simplification)
  const preferences = [];
  if (activityCount > assessmentCount) {
    preferences.push('interactive', 'coding', 'worksheet');
  } else {
    preferences.push('quiz', 'coding');
  }
  
  return preferences;
}

function getPreferredTimeOfDay(activities) {
  // Count activities by time of day
  const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  
  activities.forEach(activity => {
    const date = new Date(activity.completedAt);
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) timeCounts.morning++;
    else if (hour >= 12 && hour < 17) timeCounts.afternoon++;
    else if (hour >= 17 && hour < 22) timeCounts.evening++;
    else timeCounts.night++;
  });
  
  // Find preferred time
  return Object.entries(timeCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function generateRandomResponses(overallScore) {
  // Generate 5-10 mock question responses
  const questionCount = Math.floor(Math.random() * 6) + 5;
  const responses = [];
  
  for (let i = 0; i < questionCount; i++) {
    // Determine if this response is correct based on overall score
    const isCorrect = Math.random() * 100 < overallScore;
    
    responses.push({
      questionIndex: i,
      response: isCorrect ? 'correct_answer_placeholder' : 'incorrect_answer_placeholder',
      isCorrect,
      pointsEarned: isCorrect ? 10 : 0
    });
  }
  
  return responses;
}

function generateLearningGoals(studentData) {
  const goals = [];
  
  // Create 1-3 learning goals
  const goalCount = Math.floor(Math.random() * 3) + 1;
  
  // Use weaknesses for goal topics
  const weaknesses = studentData.insights.areasForImprovement;
  
  for (let i = 0; i < goalCount; i++) {
    const topicIndex = i % weaknesses.length;
    const topic = weaknesses[topicIndex];
    
    const isCompleted = Math.random() > 0.7;
    const progress = isCompleted ? 100 : Math.floor(Math.random() * 70);
    
    // Create date within the past month
    const dateCreated = new Date();
    dateCreated.setDate(dateCreated.getDate() - Math.floor(Math.random() * 30));
    
    // Target date 2-4 weeks from creation
    const targetDate = new Date(dateCreated);
    targetDate.setDate(targetDate.getDate() + 14 + Math.floor(Math.random() * 14));
    
    goals.push({
      title: `Improve knowledge of ${topic}`,
      description: `Complete review materials and practice questions for ${topic}`,
      targetDate,
      isCompleted,
      progress,
      dateCreated
    });
  }
  
  return goals;
}

function calculateStreak(activities) {
  if (!activities.length) return { currentStreak: 0, longestStreak: 0 };
  
  // Get unique activity dates (by day)
  const activityDates = activities.map(a => {
    const date = new Date(a.completedAt);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  });
  
  const uniqueDates = [...new Set(activityDates)].sort();
  
  // Calculate current streak (simplified)
  let currentStreak = 1;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterdayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
  
  // If last activity was today or yesterday, streak continues
  if (uniqueDates[uniqueDates.length - 1] === todayStr) {
    currentStreak = Math.min(uniqueDates.length, 7); // Cap at 7 for sample data
  } else if (uniqueDates[uniqueDates.length - 1] === yesterdayStr) {
    currentStreak = Math.min(uniqueDates.length, 6);
  } else {
    currentStreak = 0;
  }
  
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, Math.min(uniqueDates.length, 10)), // Cap at 10
    lastActivityDate: activities[0].completedAt
  };
}

function generateBadges(studentData) {
  const badges = [];
  
  // Skill level badges
  if (studentData.overallProgress >= 50) {
    badges.push({
      name: "Intermediate Achiever",
      description: "Reached intermediate skill level",
      imageUrl: "/badges/intermediate.png",
      earnedOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  if (studentData.overallProgress >= 75) {
    badges.push({
      name: "Advanced Achiever",
      description: "Reached advanced skill level",
      imageUrl: "/badges/advanced.png",
      earnedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });
  }
  
  // Activity count badges
  if (studentData.recentActivity.length >= 5) {
    badges.push({
      name: "Active Learner",
      description: "Completed 5+ learning activities",
      imageUrl: "/badges/active.png",
      earnedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });
  }
  
  // Score badges
  const highScores = studentData.recentActivity.filter(a => a.score >= 90).length;
  if (highScores >= 2) {
    badges.push({
      name: "Excellence",
      description: "Achieved 90%+ on multiple assessments",
      imageUrl: "/badges/excellence.png",
      earnedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });
  }
  
  return badges;
}