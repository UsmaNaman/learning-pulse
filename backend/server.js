const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const assessmentRoutes = require('./routes/assessments');
const progressRoutes = require('./routes/progress');
const learningPathRoutes = require('./routes/learningPaths');
const activityRoutes = require('./routes/activities');
const analyticsRoutes = require('./routes/analytics');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://learning-pulse.example.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Import mock data routes
const mockDataRoutes = require('./routes/mockData');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/analytics', analyticsRoutes); // Analytics routes
app.use('/api/mock', mockDataRoutes); // Mount mock data routes

// Simple test route
app.get('/', (req, res) => {
  res.send('Learning Pulse API is running');
});

// Set up port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});