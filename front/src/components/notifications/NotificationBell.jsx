import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import './NotificationBell.css';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationBell() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen]              = useState(false);
  const [notifications, setNotifs]   = useState([]);
  const [loading, setLoading]        = useState(false);
  const panelRef = useRef(null);
  const socket = useSocket();

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    notificationAPI.getAll().then((res) => setNotifs(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!socket) return;
    socket.on('notification', (n) => setNotifs((prev) => [n, ...prev]));
    return () => socket.off('notification');
  }, [socket]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAll = async () => {
    await notificationAPI.markAllAsRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOne = async (id) => {
    await notificationAPI.markAsRead(id);
    setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  };

  const deleteOne = async (e, id) => {
    e.stopPropagation();
    await notificationAPI.delete(id);
    setNotifs((prev) => prev.filter((n) => n._id !== id));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="notif-wrap" ref={panelRef}>
      <button
        className="notif-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread > 0 ? ` — ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel animate-fade-in-down" role="dialog" aria-label="Notifications">
          <div className="notif-header">
            <h3 className="notif-title">Notifications</h3>
            <div className="notif-header-actions">
              {unread > 0 && (
                <button className="notif-action-btn" onClick={markAll} title="Mark all as read">
                  <CheckCheck size={14} />
                </button>
              )}
              <button className="notif-action-btn" onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-empty">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={28} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 12).map((n) => (
                <div
                  key={n._id}
                  className={`notif-item ${!n.read ? 'notif-unread' : ''}`}
                  onClick={() => markOne(n._id)}
                >
                  <div className="notif-dot" />
                  <div className="notif-body">
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  <button
                    className="notif-delete"
                    onClick={(e) => deleteOne(e, n._id)}
                    aria-label="Delete notification"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
