import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { testScoreAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANG_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  react: 'React',
  sql: 'SQL',
  'dsa-java': 'DSA (Java)',
  'dsa-python': 'DSA (Python)',
  'dsa-cpp': 'DSA (C++)',
  'machine-learning': 'Machine Learning',
  'data-analytics': 'Data Analytics',
};

const LANG_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

function ScoreBar({ pct, color }) {
  return (
    <div style={{ background: '#2d2d3f', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '6px',
          transition: 'width 0.8s ease',
        }}
      />
    </div>
  );
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div
      style={{
        background: '#1e1e2e',
        border: '1px solid #2d2d3f',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <span style={{ color: '#e2e8f0', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{label}</span>
      {sub && <span style={{ color: '#4b5563', fontSize: '0.78rem' }}>{sub}</span>}
    </div>
  );
}

export default function StatsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    testScoreAPI
      .getScores()
      .then((res) => setScores(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load statistics'))
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
        Loading statistics…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <Link to="/" style={{ color: '#6366f1' }}>← Go Home</Link>
      </div>
    );
  }

  // ── Aggregate stats ──────────────────────────────────────────────
  const totalQuizzes = scores.length;

  const langMap = {};
  scores.forEach(({ language, score, totalQuestions, percentage, date }) => {
    const pct = percentage ?? (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
    if (!langMap[language]) langMap[language] = { attempts: 0, totalPct: 0, best: 0, dates: [] };
    langMap[language].attempts++;
    langMap[language].totalPct += pct;
    if (pct > langMap[language].best) langMap[language].best = pct;
    langMap[language].dates.push(new Date(date));
  });

  const langStats = Object.entries(langMap)
    .map(([lang, d]) => ({
      lang,
      label: LANG_LABELS[lang] || lang,
      attempts: d.attempts,
      avg: Math.round(d.totalPct / d.attempts),
      best: d.best,
      lastPlayed: d.dates.sort((a, b) => b - a)[0],
    }))
    .sort((a, b) => b.avg - a.avg);

  const avgScore =
    totalQuizzes > 0
      ? Math.round(scores.reduce((acc, s) => {
          const pct = s.percentage ?? (s.totalQuestions > 0 ? Math.round((s.score / s.totalQuestions) * 100) : 0);
          return acc + pct;
        }, 0) / totalQuizzes)
      : 0;

  const bestLang = langStats[0];
  const streakLangs = langStats.length;

  // Recent 10 scores for timeline
  const recent = [...scores]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/profile" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Profile
        </Link>
        <h1 style={{ color: '#e2e8f0', margin: '0.75rem 0 0.25rem', fontSize: '1.75rem' }}>
          My Statistics
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Your complete quiz performance history</p>
      </div>

      {totalQuizzes === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            No quiz data yet. Start practicing to see your statistics here!
          </p>
          <Link
            to="/"
            style={{
              padding: '0.75rem 2rem',
              background: '#6366f1',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Start Practicing
          </Link>
        </div>
      ) : (
        <>
          {/* ── Top-line stats ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <StatCard icon="🎯" label="Quizzes Taken" value={totalQuizzes} />
            <StatCard icon="📈" label="Average Score" value={`${avgScore}%`} />
            <StatCard icon="🏆" label="Best Language" value={bestLang?.label || '—'} sub={bestLang ? `${bestLang.best}% best` : ''} />
            <StatCard icon="🌐" label="Languages" value={streakLangs} sub="practiced so far" />
          </div>

          {/* ── Per-language breakdown ── */}
          <div
            style={{
              background: '#1e1e2e',
              border: '1px solid #2d2d3f',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ color: '#e2e8f0', margin: '0 0 1.25rem', fontSize: '1.05rem' }}>
              Performance by Language
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {langStats.map(({ lang, label, attempts, avg, best }, idx) => (
                <div key={lang}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: '#d1d5db', fontWeight: 600, fontSize: '0.9rem' }}>
                      {label}
                    </span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ color: '#9ca3af' }}>{attempts} attempt{attempts !== 1 ? 's' : ''}</span>
                      <span style={{ color: '#6b7280' }}>Best: <strong style={{ color: '#10b981' }}>{best}%</strong></span>
                      <span style={{ color: LANG_COLORS[idx % LANG_COLORS.length], fontWeight: 700 }}>
                        Avg: {avg}%
                      </span>
                    </div>
                  </div>
                  <ScoreBar pct={avg} color={LANG_COLORS[idx % LANG_COLORS.length]} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent quiz history ── */}
          <div
            style={{
              background: '#1e1e2e',
              border: '1px solid #2d2d3f',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #2d2d3f' }}>
              <h2 style={{ color: '#e2e8f0', margin: 0, fontSize: '1.05rem' }}>
                Recent Quizzes
              </h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d2d3f' }}>
                  {['Language', 'Score', 'Result', 'Date'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.75rem 1.25rem',
                        color: '#6b7280',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((s, i) => {
                  const pct =
                    s.percentage ??
                    (s.totalQuestions > 0
                      ? Math.round((s.score / s.totalQuestions) * 100)
                      : 0);
                  const grade = pct >= 80 ? { label: 'Excellent', color: '#10b981' }
                    : pct >= 60 ? { label: 'Good', color: '#f59e0b' }
                    : { label: 'Keep Going', color: '#ef4444' };
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #12121a' }}>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#d1d5db', fontSize: '0.9rem', fontWeight: 500 }}>
                        {LANG_LABELS[s.language] || s.language}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                        {s.score}/{s.totalQuestions}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span
                          style={{
                            background: grade.color + '22',
                            color: grade.color,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          {pct}% — {grade.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#4b5563', fontSize: '0.82rem' }}>
                        {new Date(s.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
