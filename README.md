# Learning Pulse: KS4 Computer Science Skills Tracker

## Overview

Learning Pulse is a comprehensive web-based system designed to support KS4 Computer Science students in tracking their progress, identifying knowledge gaps, and accessing appropriate revision materials. This blended e-learning platform bridges classroom instruction with independent learning, empowering students to take ownership of their revision journey.

![Dashboard Screenshot](screenshots/dashboard.png)

### Key Features

- **Student Progress Dashboard**: Visual tracking of mastery levels across curriculum topics
- **Personalized Learning Paths**: Customized recommendations based on assessment performance
- **Resource Library**: Organized collection of learning materials mapped to curriculum topics
- **Assessment Integration**: Tracking of formative and summative assessment results
- **Metacognitive Development**: Tools to help students understand their learning progress

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Setup Process

1. Clone the repository:
```bash
git clone https://github.com/UsmaNaman/learning-pulse.git
cd learning-pulse
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your specific configuration
```

4. Initialize the database:
```bash
npm run seed
# This will populate the database with KS4 Computer Science curriculum data
```

5. Start the development server:
```bash
npm run dev
# Application will be available at http://localhost:3000
```

## System Architecture

Learning Pulse uses a modern web stack:
- **Frontend**: React.js with Material UI components
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT-based user authentication

## Project Structure

This project follows a modern client-server architecture with clear separation of concerns:

- **Backend**: Express.js API server with MongoDB
- **Frontend**: React.js single-page application
- **Database**: MongoDB schemas and models

### Backend Structure

```
/backend
  /config          # Configuration files
  /controllers     # API controllers
  /middleware      # Express middleware
  /models          # MongoDB models
  /routes          # API route definitions
  server.js        # Express app entry point
```

### Frontend Structure

```
/frontend
  /public          # Static assets
  /src
    /components    # Reusable React components
    /context       # React context providers
    /hooks         # Custom React hooks
    /pages         # Page components
    /services      # API service modules
    /styles        # CSS stylesheets
    /utils         # Utility functions
    App.js         # Main app component
    index.js       # Entry point
```

## Usage Guide

### For Teachers

1. **Dashboard**: View class-wide progress and identify common areas for improvement
2. **Student Profiles**: Access detailed information about individual student progress
3. **Resource Management**: Add and categorize learning resources
4. **Assessment Entry**: Record assessment results and generate feedback

### For Students

1. **Personal Dashboard**: View progress across curriculum topics
2. **Resource Access**: Find relevant learning materials based on current mastery level
3. **Self-Assessment**: Record completion of learning activities and self-evaluate understanding
4. **Learning Plan**: Follow personalized recommendations for revision

## Data Models

### Core Data Structures

- **User**: Student and teacher profiles with authentication information
- **Curriculum Topic**: KS4 Computer Science topics organized by categories
- **Mastery Level**: Five-level framework (Novice, Developing, Proficient, Advanced, Expert)
- **Resource**: Learning materials linked to curriculum topics
- **Assessment**: Results tracking with competency measurements

## Running the Application

1. Start the backend:
   ```
   cd backend
   npm start
   ```
2. Start the frontend:
   ```
   cd frontend
   npm start
   ```

The backend will run on http://localhost:5000 and the frontend on http://localhost:3000.

## Customization

### Curriculum Modification

The system can be adapted to different subjects by modifying the curriculum data structure:

1. Navigate to `/data/curriculum.js`
2. Follow the existing structure to add or modify topics
3. Run `npm run update-curriculum` to update the database

### Mastery Levels

Customize the mastery level descriptions and thresholds:

1. Edit `/config/masteryLevels.js`
2. Adjust thresholds and descriptions as needed

## Deployment

### Production Deployment

1. Build the production version:
```bash
npm run build
```

2. Set up environment variables for production:
```
NODE_ENV=production
MONGODB_URI=[your-production-mongodb-uri]
JWT_SECRET=[your-secret-key]
```

3. Deploy to your preferred hosting service (Heroku, Vercel, AWS, etc.)

## Security

- User authentication via JWT tokens
- Role-based access control (student, teacher, admin)
- Encrypted password storage
- Input validation and sanitization

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios, Material UI
- **Authentication**: JWT (JSON Web Tokens)

## Future Development

- Mobile application for improved accessibility
- Advanced analytics dashboard for teachers
- Parent portal for progress monitoring
- Integration with external learning platforms

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Metacognitive principles from the Education Endowment Foundation
- React and Material UI for frontend components
- MongoDB for flexible data storage

---

*Learning Pulse was developed by UsmaNaman as part of a Computing education project focused on enhancing student revision experiences through technology-supported blended learning.*# learning-pulse
