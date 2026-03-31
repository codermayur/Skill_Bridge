import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { testScoreAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANG_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  react: 'React',
  sql: 'SQL',
  'dsa-java': 'DSA — Java',
  'dsa-python': 'DSA — Python',
  'dsa-cpp': 'DSA — C++',
  'machine-learning': 'Machine Learning',
  'data-analytics': 'Data Analytics',
};

function CircularProgress({ percentage }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  const color =
    percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke="#2d2d3f" strokeWidth="12"
        />
        {/* Progress */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '2.25rem', fontWeight: 800, color, lineHeight: 1 }}>
          {percentage}%
        </span>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>score</span>
      </div>
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const submitted = useRef(false);

  const { score, totalQuestions, language, answers } = location.state || {};
  const finalScore = score ?? 0;
  const total = totalQuestions ?? 10;
  const lang = language ?? 'unknown';
  const langLabel = LANG_LABELS[lang] || lang;
  const percentage = total > 0 ? Math.round((finalScore / total) * 100) : 0;

  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error

  const grade =
    percentage >= 80 ? { label: 'Excellent!',     emoji: '🏆', color: '#10b981' } :
    percentage >= 60 ? { label: 'Good Job!',       emoji: '⭐', color: '#f59e0b' } :
    percentage >= 40 ? { label: 'Keep Practicing!',emoji: '💪', color: '#f97316' } :
                       { label: 'Try Again!',       emoji: '📚', color: '#ef4444' };

  // Auto-submit once, only when logged in
  useEffect(() => {
    if (!isLoggedIn || submitted.current || score === undefined) return;
    submitted.current = true;
    setSaveStatus('saving');

    testScoreAPI
      .submitScore(lang, finalScore, total, answers || [])
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
  }, [isLoggedIn]);

  // Guard: navigated here without state (e.g. direct URL)
  if (score === undefined) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
      }}>
        <p style={{ color: '#9ca3af' }}>No quiz data found.</p>
        <Link to="/" style={{
          padding: '0.6rem 1.5rem', background: '#6366f1', color: '#fff',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
        }}>
          Go Home
        </Link>
      </div>
    );
  }

  const practiceRoute = `/practice/${lang}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '520px',
        background: '#1e1e2e',
        border: '1px solid #2d2d3f',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: '2rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{grade.emoji}</div>
          <h1 style={{ color: grade.color, margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800 }}>
            {grade.label}
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
            {langLabel} Quiz Complete
          </p>
        </div>

        {/* Score ring */}
        <CircularProgress percentage={percentage} />

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.75rem',
        }}>
          {[
            { label: 'Correct',   value: finalScore,          color: '#10b981' },
            { label: 'Incorrect', value: total - finalScore,  color: '#ef4444' },
            { label: 'Total',     value: total,               color: '#6366f1' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#12121a',
              border: '1px solid #2d2d3f',
              borderRadius: '10px',
              padding: '1rem 0.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Save status */}
        {isLoggedIn && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.75rem 1rem',
            background: saveStatus === 'saved'  ? '#10b98122'
                      : saveStatus === 'error'  ? '#ef444422'
                      : saveStatus === 'saving' ? '#6366f122'
                      : 'transparent',
            border: `1px solid ${
              saveStatus === 'saved'  ? '#10b981'
            : saveStatus === 'error'  ? '#ef4444'
            : saveStatus === 'saving' ? '#6366f1'
            : '#2d2d3f'}`,
            borderRadius: '8px',
            fontSize: '0.875rem',
          }}>
            {saveStatus === 'saving' && (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                <span style={{ color: '#818cf8' }}>Saving your score…</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span>✅</span>
                <span style={{ color: '#10b981' }}>
                  Score saved! Check your{' '}
                  <Link to="/stats" style={{ color: '#10b981', fontWeight: 600 }}>
                    statistics
                  </Link>
                  {' '}or your email for details.
                </span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span>⚠️</span>
                <span style={{ color: '#ef4444' }}>
                  Couldn't save score — check your connection.
                </span>
              </>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#6366f122',
            border: '1px solid #6366f1',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#818cf8',
          }}>
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign in</Link>
            {' '}to save your score and track progress.
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1, padding: '0.85rem',
              background: '#2d2d3f', border: '1px solid #374151',
              borderRadius: '10px', color: '#d1d5db',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
              transition: 'background 0.15s',
            }}
          >
            ← Home
          </button>
          <button
            onClick={() => navigate(practiceRoute)}
            style={{
              flex: 1, padding: '0.85rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '10px', color: '#fff',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
              transition: 'opacity 0.15s',
            }}
          >
            Try Again →
          </button>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
