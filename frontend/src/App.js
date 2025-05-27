import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
// import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import StudentReport from './pages/StudentReport';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: '#f8f9fa', paddingTop: '1rem', paddingBottom: '3rem' }}>
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
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </main>
            <footer style={{ 
              textAlign: 'center', 
              padding: '1.5rem 0',
              backgroundColor: '#fff',
              borderTop: '1px solid #eaeaea'
            }}>
              <p>&copy; {new Date().getFullYear()} Learning Pulse</p>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;