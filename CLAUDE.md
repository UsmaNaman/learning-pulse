# Learning Pulse - Development Guidelines

## Commands
- **Start all services**: `npm start` (backend on 5000, frontend on 3001)
- **Backend only**: `npm run backend` (runs with nodemon for hot reload)
- **Frontend only**: `npm run frontend`
- **Install all packages**: `npm run install-all`
- **Seed database**: `npm run seed`
- **Run frontend tests**: `cd frontend && npm test`
- **Run single test**: `cd frontend && npm test -- -t "test name"`

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