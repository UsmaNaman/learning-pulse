import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
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

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleHint = searchParams.get('role'); // 'teacher' | 'student' | null

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setServerError('');
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel = roleHint === 'teacher' ? 'Teacher' : roleHint === 'student' ? 'Student' : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',sans-serif", position: 'relative', padding: '32px 0' }}>
      <div style={gridBg} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 16px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.5px' }}>Learning</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#00e5a0', letterSpacing: '-0.5px' }}>Pulse</span>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, backdropFilter: 'blur(8px)', padding: 36 }}>
          <h1 style={{ color: '#f0f2f8', fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Create your account
            {roleLabel && <span style={{ color: '#00e5a0' }}> — {roleLabel}</span>}
          </h1>
          <p style={{ color: 'rgba(232,234,240,0.5)', fontSize: 14, margin: '0 0 28px' }}>
            Free during beta · No credit card required
          </p>

          {serverError && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#ff6b6b', fontSize: 14 }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Full name</label>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              style={{ ...inputStyle, borderColor: errors.name ? 'rgba(255,107,107,0.6)' : undefined }}
              placeholder="Your name"
            />
            {errors.name && <p style={errorMsg}>{errors.name}</p>}

            <label style={{ ...labelStyle, marginTop: 16 }}>Email address</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...inputStyle, borderColor: errors.email ? 'rgba(255,107,107,0.6)' : undefined }}
              placeholder="you@school.edu"
            />
            {errors.email && <p style={errorMsg}>{errors.email}</p>}

            <label style={{ ...labelStyle, marginTop: 16 }}>Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              style={{ ...inputStyle, borderColor: errors.password ? 'rgba(255,107,107,0.6)' : undefined }}
              placeholder="At least 6 characters"
            />
            {errors.password && <p style={errorMsg}>{errors.password}</p>}

            <label style={{ ...labelStyle, marginTop: 16 }}>Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ ...inputStyle, borderColor: errors.confirmPassword ? 'rgba(255,107,107,0.6)' : undefined }}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p style={errorMsg}>{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ ...btnPrimary, marginTop: 24, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isSubmitting ? <CircularProgress size={18} sx={{ color: '#0a0e1a' }} /> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(232,234,240,0.4)' }}>
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
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

const errorMsg = {
  color: '#ff6b6b',
  fontSize: 12,
  margin: '5px 0 0',
};

export default Register;
