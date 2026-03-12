# Learning Pulse - Development Guidelines

## Commands
- **Start all services**: `npm start` (backend on **5001**, frontend on **3001**)
- **Backend only**: `npm run backend` (runs with nodemon for hot reload)
- **Frontend only**: `npm run frontend`
- **Install all packages**: `npm run install-all`
- **Seed database**: `npm run seed`
- **Run frontend tests**: `cd frontend && npm test`
- **Run single test**: `cd frontend && npm test -- -t "test name"`

## Ports
- **Backend API**: `http://localhost:5001` — port 5000 is taken by macOS AirPlay Receiver
- **Frontend**: `http://localhost:3001/learning-pulse`

## Local Setup Requirements
- **MongoDB**: Installed via Homebrew, runs as a background service
  - Start: `brew services start mongodb/brew/mongodb-community`
  - Stop: `brew services stop mongodb/brew/mongodb-community`
  - MongoDB auto-starts at login once enabled
- **Node.js**: Uses `npx` to invoke local binaries (nodemon, react-scripts) — do not rely on global installs

## Environment Files
- `backend/.env` — MongoDB URI, PORT (5001), JWT_SECRET, CORS_ORIGIN
- `frontend/.env` — REACT_APP_API_URL points to `http://localhost:5001/api`
- `frontend/.env.production` — REACT_APP_API_URL for cloud backend (update when deploying to Render)

## Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Instructor | `smith@school.edu` | `password123` |
| Instructor | `jones@school.edu` | `password123` |
| Student | `john.s@school.edu` | `student123` |
| Student | `emily.j@school.edu` | `student123` |

## Code Style

### Backend (Node.js/Express)
- Use ES6+ features with CommonJS module syntax (require/exports)
- Error handling: try/catch blocks with proper error responses
- Validation: Use express-validator for request validation
- Mongoose: Use async/await with proper error handling
- Controllers: Structured with route comments, error validation, and clear response patterns

### Frontend (React)
- Functional components with hooks
- Material UI for component library
- React Router for navigation
- Context API for state management
- Import order: React, libraries, contexts, components, utilities
- Style components using Material UI's styling system or inline styles

## Naming Conventions
- camelCase for variables, functions, and methods
- PascalCase for components, classes, and models
- snake_case for environment variables
- Descriptive variable names that indicate purpose

## Type Safety
- Use JSDoc comments for type documentation
- Consider type checking with PropTypes for React components