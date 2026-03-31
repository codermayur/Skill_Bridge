import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2, Zap, Check } from 'lucide-react';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import './auth/Auth.css';

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase',     ok: /[A-Z]/.test(password) },
    { label: 'Number',        ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['var(--error)', 'var(--warning)', 'var(--success)'];
  const labels = ['Weak', 'Fair', 'Strong'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0,1,2].map((i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < score ? colors[score - 1] : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {checks.map(({ label, ok }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
            <Check size={11} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Signup() {
  const [form, setForm]         = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => { if (isLoggedIn) navigate('/profile', { replace: true }); }, [isLoggedIn, navigate]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Enter your full name';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'At least 6 characters';
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
      const res = await authAPI.signup(form.fullName, form.email, form.password);
      login(res.token, res.user);
      navigate('/profile');
    } catch (err) {
      setErrors({ submit: err.message || 'Sign up failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Zap size={20} strokeWidth={2.5} /></div>
          <span className="auth-logo-text">Skill<span>Bridge</span></span>
        </Link>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join thousands of developers learning together</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="fullName" className="auth-label">Full name</label>
            <div className="auth-input-wrap">
              <input
                id="fullName" type="text" name="fullName"
                value={form.fullName} onChange={onChange}
                placeholder="Jane Doe"
                className={`auth-input ${errors.fullName ? 'error' : ''}`}
                autoComplete="name" autoFocus
              />
              <span className="auth-input-icon"><User size={16} /></span>
            </div>
            {errors.fullName && <span className="auth-error"><AlertCircle size={12} />{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <input
                id="email" type="email" name="email"
                value={form.email} onChange={onChange}
                placeholder="you@example.com"
                className={`auth-input ${errors.email ? 'error' : ''}`}
                autoComplete="email"
              />
              <span className="auth-input-icon"><Mail size={16} /></span>
            </div>
            {errors.email && <span className="auth-error"><AlertCircle size={12} />{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password" type={showPass ? 'text' : 'password'} name="password"
                value={form.password} onChange={onChange}
                placeholder="Create a strong password"
                className={`auth-input ${errors.password ? 'error' : ''}`}
                autoComplete="new-password"
              />
              <button type="button" className="auth-input-icon" onClick={() => setShowPass((v) => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && <PasswordStrength password={form.password} />}
            {errors.password && <span className="auth-error"><AlertCircle size={12} />{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="auth-alert"><AlertCircle size={16} />{errors.submit}</div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
