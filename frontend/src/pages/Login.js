import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const gridBg = {
  position: 'fixed',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)
  `,
  backgroundSize: '48px 48px',
  pointerEvents: 'none',
  zIndex: 0,
};

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsSubmitting(true);
    setError('');
    const demoCredentials = {
      email: role === 'john' ? 'john.s@school.edu'
           : role === 'emily' ? 'emily.j@school.edu'
           : 'jones@school.edu',
      password: 'demo123',
    };
    try {
      await login(demoCredentials);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login with demo account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',sans-serif", position: 'relative' }}>
      <div style={gridBg} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 16px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.5px' }}>Learning</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#00e5a0', letterSpacing: '-0.5px' }}>Pulse</span>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, backdropFilter: 'blur(8px)', padding: 36 }}>
          <h1 style={{ color: '#f0f2f8', fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(232,234,240,0.5)', fontSize: 14, margin: '0 0 28px' }}>Sign in to your Learning Pulse account</p>

          {error && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#ff6b6b', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Email address</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="you@school.edu"
            />

            <label style={{ ...labelStyle, marginTop: 16 }}>Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...btnPrimary, marginTop: 24, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isSubmitting ? <CircularProgress size={18} sx={{ color: '#0a0e1a' }} /> : 'Sign In'}
            </button>
          </form>

          {/* Demo logins */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'rgba(232,234,240,0.35)', fontSize: 12, textAlign: 'center', marginBottom: 12, letterSpacing: 0.3 }}>
              DEMO ACCOUNTS
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btnDemo} onClick={() => handleDemoLogin('john')} disabled={isSubmitting}>
                John Smith<br /><span style={{ fontSize: 10, opacity: 0.6 }}>Student</span>
              </button>
              <button style={btnDemo} onClick={() => handleDemoLogin('emily')} disabled={isSubmitting}>
                Emily Jones<br /><span style={{ fontSize: 10, opacity: 0.6 }}>Student</span>
              </button>
              <button style={btnDemo} onClick={() => handleDemoLogin('instructor')} disabled={isSubmitting}>
                Mr Jones<br /><span style={{ fontSize: 10, opacity: 0.6 }}>Teacher</span>
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(232,234,240,0.4)', margin: '24px 0 0' }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 600 }}>
              Sign Up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'rgba(232,234,240,0.7)',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  color: '#f0f2f8',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: "'DM Sans','Segoe UI',sans-serif",
};

const btnPrimary = {
  background: '#00e5a0',
  color: '#0a0e1a',
  border: 'none',
  borderRadius: 10,
  padding: '13px 20px',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  letterSpacing: '-0.3px',
  fontFamily: "'DM Sans','Segoe UI',sans-serif",
};

const btnDemo = {
  flex: 1,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 6px',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(232,234,240,0.7)',
  cursor: 'pointer',
  textAlign: 'center',
  lineHeight: 1.4,
  transition: 'all 0.2s',
  fontFamily: "'DM Sans','Segoe UI',sans-serif",
};

export default Login;
