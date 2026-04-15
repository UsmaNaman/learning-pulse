import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import './styles/accessibility.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboardSelector from './components/StudentDashboardSelector';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
// import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import StudentReport from './pages/StudentReport';
import BinaryLessonPage from './pages/BinaryLessonPage';

function AppInner() {
  const { currentUser } = useAuth();
  return (
    <Router basename="/learning-pulse">
      <div className="app">
        {currentUser && <Navbar />}
        <main style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '1rem', paddingBottom: '3rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            {/* <Route path="/courses/:courseId" element={<CourseDetail />} /> */}

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student-report/:studentId" element={<StudentReport />} />
              <Route path="/student-selector" element={<StudentDashboardSelector />} />
              <Route path="/lessons/binary" element={<BinaryLessonPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
        {currentUser && (
          <footer style={{
            textAlign: 'center',
            padding: '1.5rem 0',
            backgroundColor: 'rgba(10,14,26,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <p>&copy; {new Date().getFullYear()} Learning Pulse</p>
          </footer>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;