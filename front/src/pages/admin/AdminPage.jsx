import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const TAB_LABELS = ['Overview', 'Users'];

const STATUS_COLORS = {
  pending: '#f59e0b', accepted: '#3b82f6',
  in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#6b7280',
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: '#1e1e2e', border: '1px solid #2d2d3f', borderRadius: '12px',
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <span style={{ color: color || '#e2e8f0', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{label}</span>
      {sub && <span style={{ color: '#4b5563', fontSize: '0.78rem' }}>{sub}</span>}
    </div>
  );
}

export default function AdminPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersMeta, setUsersMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') navigate('/');
  }, [isLoggedIn, user, navigate]);

  // Load platform stats
  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') return;
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, user]);

  // Load users when Users tab is active
  useEffect(() => {
    if (activeTab !== 'Users' || !isLoggedIn || user?.role !== 'admin') return;
    setUsersLoading(true);
    adminAPI.getUsers(usersPage)
      .then((res) => {
        setUsers(res.data || []);
        setUsersMeta({ total: res.total || 0, totalPages: res.totalPages || 1 });
      })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [activeTab, usersPage, isLoggedIn, user]);

  const handleBan = async (userId, currentBanned) => {
    setBanLoading(userId);
    try {
      await adminAPI.banUser(userId, !currentBanned);
      setUsers((prev) =>
        prev.map((u) => u._id === userId ? { ...u, isBanned: !currentBanned } : u)
      );
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setBanLoading(null);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#e2e8f0', margin: 0, fontSize: '1.75rem' }}>Admin Panel</h1>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>Platform management dashboard</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2d2d3f', marginBottom: '2rem' }}>
        {TAB_LABELS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '0.6rem 1.4rem', background: 'none', border: 'none',
            borderBottom: activeTab === t ? '2px solid #6366f1' : '2px solid transparent',
            color: activeTab === t ? '#818cf8' : '#6b7280',
            cursor: 'pointer', fontWeight: activeTab === t ? 600 : 400,
          }}>{t}</button>
        ))}
      </div>

      {loading && activeTab === 'Overview' ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading…</div>
      ) : (
        <>
          {/* ── Overview ── */}
          {activeTab === 'Overview' && stats && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem', marginBottom: '2rem',
              }}>
                <StatCard icon="👥" label="Total Users"     value={stats.users.total}            color="#818cf8" />
                <StatCard icon="📋" label="Total Requests"  value={stats.requests.total}         color="#e2e8f0" />
                <StatCard icon="⏳" label="Pending"         value={stats.requests.pending}       color="#f59e0b" />
                <StatCard icon="✅" label="Completed"       value={stats.requests.completed}     color="#10b981" />
                <StatCard icon="📈" label="Completion Rate" value={`${stats.requests.completionRate}%`} color="#6366f1" sub="of all requests" />
              </div>

              <div style={{ background: '#1e1e2e', border: '1px solid #2d2d3f', borderRadius: '10px', padding: '1.5rem' }}>
                <h2 style={{ color: '#e2e8f0', margin: '0 0 1rem', fontSize: '1rem' }}>Request Status Breakdown</h2>
                {[
                  { label: 'Pending',     value: stats.requests.pending,   color: '#f59e0b' },
                  { label: 'Completed',   value: stats.requests.completed, color: '#10b981' },
                  { label: 'In Progress', value: stats.requests.total - stats.requests.pending - stats.requests.completed, color: '#8b5cf6' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{label}</span>
                      <span style={{ color, fontWeight: 600, fontSize: '0.9rem' }}>
                        {value} ({stats.requests.total > 0 ? Math.round((value / stats.requests.total) * 100) : 0}%)
                      </span>
                    </div>
                    <div style={{ background: '#2d2d3f', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: color, borderRadius: '6px',
                        width: stats.requests.total > 0 ? `${Math.round((value / stats.requests.total) * 100)}%` : '0%',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {activeTab === 'Users' && (
            <div>
              {usersLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading users…</div>
              ) : (
                <>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {usersMeta.total} total users
                  </p>
                  <div style={{ background: '#1e1e2e', border: '1px solid #2d2d3f', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #2d2d3f' }}>
                          {['Name', 'Email', 'Role', 'Skills', 'Rep.', 'Joined', 'Actions'].map((h) => (
                            <th key={h} style={{
                              padding: '0.75rem 1rem', color: '#6b7280',
                              fontSize: '0.78rem', fontWeight: 600,
                              textAlign: 'left', textTransform: 'uppercase',
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr
                            key={u._id}
                            style={{
                              borderBottom: '1px solid #12121a',
                              opacity: u.isBanned ? 0.5 : 1,
                            }}
                          >
                            <td style={{ padding: '0.75rem 1rem', color: '#d1d5db', fontWeight: 500, fontSize: '0.9rem' }}>
                              {u.fullName}
                              {u.isBanned && (
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#ef4444', background: '#ef444422', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                  BANNED
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#9ca3af', fontSize: '0.85rem' }}>{u.email}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{
                                background: u.role === 'admin' ? '#6366f133' : '#374151',
                                color: u.role === 'admin' ? '#818cf8' : '#9ca3af',
                                padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.82rem' }}>
                              {u.skills?.length > 0 ? `${u.skills.slice(0, 2).join(', ')}${u.skills.length > 2 ? ` +${u.skills.length - 2}` : ''}` : '—'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                              {u.reputation?.totalReviews > 0 ? `⭐ ${u.reputation.score}` : '—'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.8rem' }}>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleBan(u._id, u.isBanned)}
                                  disabled={banLoading === u._id}
                                  style={{
                                    padding: '0.3rem 0.75rem',
                                    background: u.isBanned ? '#10b98122' : '#ef444422',
                                    border: `1px solid ${u.isBanned ? '#10b981' : '#ef4444'}`,
                                    borderRadius: '6px',
                                    color: u.isBanned ? '#10b981' : '#ef4444',
                                    cursor: banLoading === u._id ? 'not-allowed' : 'pointer',
                                    fontSize: '0.8rem', fontWeight: 600,
                                  }}
                                >
                                  {banLoading === u._id ? '…' : u.isBanned ? 'Unban' : 'Ban'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* User pagination */}
                  {usersMeta.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button
                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                        disabled={usersPage <= 1}
                        style={{ padding: '0.4rem 0.9rem', background: '#1e1e2e', border: '1px solid #2d2d3f', borderRadius: '6px', color: usersPage <= 1 ? '#4b5563' : '#9ca3af', cursor: usersPage <= 1 ? 'not-allowed' : 'pointer' }}
                      >← Prev</button>
                      <span style={{ padding: '0.4rem 0.9rem', color: '#6b7280', fontSize: '0.9rem' }}>
                        Page {usersPage} of {usersMeta.totalPages}
                      </span>
                      <button
                        onClick={() => setUsersPage((p) => Math.min(usersMeta.totalPages, p + 1))}
                        disabled={usersPage >= usersMeta.totalPages}
                        style={{ padding: '0.4rem 0.9rem', background: '#1e1e2e', border: '1px solid #2d2d3f', borderRadius: '6px', color: usersPage >= usersMeta.totalPages ? '#4b5563' : '#9ca3af', cursor: usersPage >= usersMeta.totalPages ? 'not-allowed' : 'pointer' }}
                      >Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
