import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Calendar, Edit2, Check, X, Plus,
  Trophy, Code2, BarChart2, Zap, AlertCircle,
  Loader2, BookOpen, ArrowRight,
} from 'lucide-react';
import { userAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import Avatar from './components/ui/Avatar';
import Button from './components/ui/Button';
import './components/ui/Button.css';
import './components/ui/Avatar.css';
import './Profile.css';

const LANG_LABELS = {
  javascript: 'JavaScript', python: 'Python', java: 'Java',
  cpp: 'C++', react: 'React', sql: 'SQL',
  'dsa-java': 'DSA (Java)', 'dsa-python': 'DSA (Python)', 'dsa-cpp': 'DSA (C++)',
  'machine-learning': 'ML', 'data-analytics': 'Data Analytics',
};

function computeStats(testScores = []) {
  if (!testScores.length) return { total: 0, languages: 0, avgScore: 0, bestLanguage: '—' };
  const langMap = {};
  testScores.forEach(({ language, score, totalQuestions }) => {
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    if (!langMap[language]) langMap[language] = [];
    langMap[language].push(pct);
  });
  const allPct = testScores.map(({ score, totalQuestions }) =>
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  );
  const avgScore = Math.round(allPct.reduce((a, b) => a + b, 0) / allPct.length);
  const bestLang = Object.entries(langMap).reduce((best, [lang, percs]) => {
    const avg = Math.round(percs.reduce((a, b) => a + b, 0) / percs.length);
    return avg > best.avg ? { lang, avg } : best;
  }, { lang: '—', avg: -1 }).lang;
  return { total: testScores.length, languages: Object.keys(langMap).length, avgScore, bestLanguage: LANG_LABELS[bestLang] || bestLang };
}

export default function Profile() {
  const [userData, setUserData]   = useState(null);
  const [stats, setStats]         = useState({ total: 0, languages: 0, avgScore: 0, bestLanguage: '—' });
  const [recentScores, setRecent] = useState([]);
  const [isEditing, setEditing]   = useState(false);
  const [editData, setEditData]   = useState({ fullName: '', email: '', bio: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const navigate  = useNavigate();
  const { isLoggedIn, updateUser } = useAuth();

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await userAPI.getProfile();
      const p = res.data;
      setUserData(p);
      setEditData({ fullName: p.fullName || '', email: p.email || '', bio: p.bio || '', skills: p.skills || [] });
      setStats(computeStats(p.testScores));
      setRecent((p.testScores || []).slice(-5).reverse());
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    fetchProfile();
  }, [isLoggedIn, navigate, fetchProfile]);

  const addSkill = (s) => {
    const sk = s.trim();
    if (sk && !editData.skills.includes(sk) && editData.skills.length < 15)
      setEditData((p) => ({ ...p, skills: [...p.skills, sk] }));
    setSkillInput('');
  };
  const removeSkill = (s) => setEditData((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const res = await userAPI.updateProfile(editData.fullName, editData.email, editData.bio, editData.skills);
      const updated = { ...res.data, bio: editData.bio, skills: editData.skills };
      setUserData((p) => ({ ...p, ...updated }));
      updateUser(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p>Loading profile…</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-loading">
        <AlertCircle size={32} style={{ color: 'var(--error)' }} />
        <p style={{ color: 'var(--error)' }}>{error}</p>
        <Button size="sm" onClick={fetchProfile}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* ── Sidebar Card ── */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar-inner">
              {/* Avatar + name */}
              <div className="profile-identity">
                <Avatar name={userData.fullName || '?'} size="2xl" />
                <div>
                  <h1 className="profile-name">{userData.fullName}</h1>
                  <div className="profile-meta-row">
                    <Mail size={13} />
                    <span>{userData.email}</span>
                  </div>
                  {userData.createdAt && (
                    <div className="profile-meta-row">
                      <Calendar size={13} />
                      <span>Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {userData.bio && (
                <p className="profile-bio">{userData.bio}</p>
              )}

              {/* Skills */}
              {userData.skills?.length > 0 && (
                <div className="profile-skills-wrap">
                  <span className="profile-section-label">Skills</span>
                  <div className="profile-skills">
                    {userData.skills.map((s) => (
                      <span key={s} className="tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reputation */}
              {userData.reputation?.totalReviews > 0 && (
                <div className="profile-rep">
                  <span className="profile-section-label">Reputation</span>
                  <div className="profile-rep-score">
                    <Trophy size={16} style={{ color: 'var(--warning)' }} />
                    <strong>{userData.reputation.score}</strong>
                    <span>({userData.reputation.totalReviews} reviews)</span>
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                fullWidth
                leftIcon={<Edit2 size={14} />}
                onClick={() => { setEditing((v) => !v); setError(''); }}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="profile-main">
            {error && (
              <div className="profile-alert">
                <AlertCircle size={16} />{error}
              </div>
            )}

            {/* ── Edit form ── */}
            {isEditing && (
              <div className="profile-card profile-edit-card animate-fade-in">
                <h2 className="profile-card-title">Edit Profile</h2>

                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label className="profile-field-label"><User size={14} /> Full Name</label>
                    <input className="profile-input" type="text" value={editData.fullName}
                      onChange={(e) => setEditData((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Your full name" />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label"><Mail size={14} /> Email</label>
                    <input className="profile-input" type="email" value={editData.email}
                      onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Bio <span className="profile-field-hint">(max 500 characters)</span></label>
                  <textarea className="profile-input profile-textarea" value={editData.bio} rows={3}
                    onChange={(e) => setEditData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell others what you can help with…" maxLength={500} />
                  <span className="profile-field-hint">{editData.bio.length}/500</span>
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Skills <span className="profile-field-hint">(max 15)</span></label>
                  <div className="profile-skill-input-row">
                    <input className="profile-input" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                      placeholder="Type a skill and press Enter" />
                    <Button size="sm" variant="outline" onClick={() => addSkill(skillInput)} leftIcon={<Plus size={13} />}>
                      Add
                    </Button>
                  </div>
                  {editData.skills.length > 0 && (
                    <div className="profile-skill-tags">
                      {editData.skills.map((s) => (
                        <span key={s} className="profile-skill-tag">
                          {s}
                          <button onClick={() => removeSkill(s)}><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="profile-form-actions">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button size="sm" loading={saving} leftIcon={<Check size={14} />} onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* ── Stats overview ── */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h2 className="profile-card-title">Quiz Performance</h2>
                <Button as={Link} to="/stats" size="xs" variant="ghost" rightIcon={<ArrowRight size={12} />}>
                  Full Stats
                </Button>
              </div>

              <div className="profile-stats-grid stagger-children">
                {[
                  { icon: <BookOpen size={18} />, value: stats.total,    label: 'Quizzes Taken',     color: 'var(--primary)' },
                  { icon: <Code2    size={18} />, value: stats.languages, label: 'Languages',         color: 'var(--secondary)' },
                  { icon: <BarChart2 size={18} />,value: stats.total > 0 ? `${stats.avgScore}%` : '—', label: 'Avg. Score', color: 'var(--info)' },
                  { icon: <Trophy   size={18} />, value: stats.bestLanguage, label: 'Best Language', color: 'var(--warning)' },
                ].map(({ icon, value, label, color }) => (
                  <div key={label} className="profile-stat-item">
                    <div className="profile-stat-icon" style={{ '--ic': color }}>{icon}</div>
                    <div>
                      <div className="profile-stat-value" style={{ color }}>{value}</div>
                      <div className="profile-stat-label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent activity ── */}
            <div className="profile-card">
              <h2 className="profile-card-title">Recent Activity</h2>

              {recentScores.length === 0 ? (
                <div className="profile-empty">
                  <Zap size={24} style={{ color: 'var(--text-muted)' }} />
                  <p>No quiz activity yet.</p>
                  <Link to="/" style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)' }}>Start practicing →</Link>
                </div>
              ) : (
                <div className="profile-activity">
                  {recentScores.map((s, i) => {
                    const pct = s.totalQuestions > 0 ? Math.round((s.score / s.totalQuestions) * 100) : 0;
                    const barColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)';
                    return (
                      <div key={i} className="profile-activity-item">
                        <div className="profile-activity-info">
                          <span className="profile-activity-lang">{LANG_LABELS[s.language] || s.language}</span>
                          <span className="profile-activity-date">{new Date(s.date).toLocaleDateString()}</span>
                        </div>
                        <div className="profile-activity-score">
                          <div className="profile-activity-bar">
                            <div style={{ width: `${pct}%`, background: barColor, height: '100%', borderRadius: '2px', transition: 'width 0.8s var(--ease-out)' }} />
                          </div>
                          <span style={{ color: barColor, fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-sm)', minWidth: '40px', textAlign: 'right' }}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
