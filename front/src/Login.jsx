import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Zap } from 'lucide-react';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import './auth/Auth.css';

export default function Login() {
  const [form, setForm]             = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => { if (isLoggedIn) navigate('/profile', { replace: true }); }, [isLoggedIn, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email.trim())                     e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                          e.password = 'Password is required';
    else if (form.password.length < 6)           e.password = 'At least 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login(form.email, form.password);
      login(res.token, res.user);
      navigate('/profile');
    } catch (err) {
      setErrors({ submit: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Zap size={20} strokeWidth={2.5} /></div>
          <span className="auth-logo-text">Skill<span>Bridge</span></span>
        </Link>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <input
                id="email" type="email" name="email"
                value={form.email} onChange={onChange}
                placeholder="you@example.com"
                className={`auth-input ${errors.email ? 'error' : ''}`}
                autoComplete="email" autoFocus
              />
              <span className="auth-input-icon"><Mail size={16} /></span>
            </div>
            {errors.email && <span className="auth-error"><AlertCircle size={12} />{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
              <Link to="/forgot-password">Forgot password?</Link>
            </label>
            <div className="auth-input-wrap">
              <input
                id="password" type={showPass ? 'text' : 'password'} name="password"
                value={form.password} onChange={onChange}
                placeholder="••••••••"
                className={`auth-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button type="button" className="auth-input-icon" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-error"><AlertCircle size={12} />{errors.password}</span>}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="auth-alert"><AlertCircle size={16} />{errors.submit}</div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-link">
          Don't have an account? <Link to="/signup">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
