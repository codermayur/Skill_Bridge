import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Plus, Clock, User,
  ChevronLeft, ChevronRight, ArrowUpDown, X,
} from 'lucide-react';
import { requestAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { RequestCardSkeleton } from '../../components/ui/Skeleton';
import '../../components/ui/Button.css';
import '../../components/ui/Badge.css';
import '../../components/ui/Avatar.css';
import '../../components/ui/Skeleton.css';
import '../../components/ui/EmptyState.css';
import '../../components/ui/Card.css';
import './RequestsPage.css';

const CATEGORIES = ['All','Programming','Design','Writing','Marketing','Tutoring','Tech Support','Data & Analytics','Other'];
const STATUSES   = ['All','pending','accepted','in_progress','completed'];
const SORTS      = [
  { value: 'newest',  label: 'Newest first'  },
  { value: 'oldest',  label: 'Oldest first'  },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function RequestCard({ request, onAccept }) {
  const { isLoggedIn, user } = useAuth();
  const [accepting, setAccepting] = useState(false);

  const isOwn = user?._id === request.requester?._id;
  const canAccept = isLoggedIn && !isOwn && request.status === 'pending';

  const handleAccept = async (e) => {
    e.preventDefault();
    setAccepting(true);
    try { await onAccept(request._id); }
    finally { setAccepting(false); }
  };

  return (
    <Link to={`/requests/${request._id}`} className="req-card animate-fade-in">
      {/* Top row */}
      <div className="req-card-top">
        <span className="req-card-category">{request.category}</span>
        <StatusBadge status={request.status} />
      </div>

      {/* Title */}
      <h3 className="req-card-title line-clamp-2">{request.title}</h3>

      {/* Description */}
      <p className="req-card-desc line-clamp-3">{request.description}</p>

      {/* Skills */}
      {request.skills?.length > 0 && (
        <div className="req-card-skills">
          {request.skills.slice(0, 4).map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
          {request.skills.length > 4 && (
            <span className="tag tag-more">+{request.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="req-card-footer">
        <div className="req-card-meta">
          <Avatar name={request.requester?.fullName || '?'} size="xs" />
          <span className="req-card-requester">
            {request.requester?.fullName || 'Anonymous'}
          </span>
          <span className="req-card-dot">·</span>
          <Clock size={12} />
          <span className="req-card-time">{timeAgo(request.createdAt)}</span>
        </div>

        {canAccept && (
          <Button
            size="xs"
            variant="primary"
            loading={accepting}
            onClick={handleAccept}
          >
            Accept
          </Button>
        )}
      </div>
    </Link>
  );
}

export default function RequestsPage() {
  const [params, setParams] = useSearchParams();
  const [requests, setRequests]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [filtersOpen, setFilters] = useState(false);
  const { isLoggedIn } = useAuth();

  const page     = parseInt(params.get('page')     || '1');
  const search   = params.get('search')   || '';
  const category = params.get('category') || '';
  const status   = params.get('status')   || '';
  const sort     = params.get('sort')     || 'newest';
  const limit    = 12;

  const totalPages = Math.ceil(total / limit);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setParams(next);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await requestAPI.getAll({
        page, limit,
        search:   search   || undefined,
        category: category || undefined,
        status:   status   || undefined,
      });
      let data = res.data || [];
      if (sort === 'oldest') data = [...data].reverse();
      setRequests(data);
      setTotal(res.total || data.length);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, sort]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAccept = async (id) => {
    await requestAPI.accept(id);
    fetchRequests();
  };

  const hasFilters = search || category || status;

  const clearFilters = () => {
    const next = new URLSearchParams();
    setParams(next);
  };

  return (
    <div className="req-page">
      <div className="container">
        {/* ── Page header ── */}
        <div className="req-page-header">
          <div>
            <h1 className="req-page-title">Help Requests</h1>
            <p className="req-page-subtitle">
              {total > 0 ? `${total} request${total !== 1 ? 's' : ''} found` : 'Browse open requests'}
            </p>
          </div>

          {isLoggedIn && (
            <Button
              as={Link}
              to="/requests/new"
              size="md"
              leftIcon={<Plus size={16} />}
            >
              Post Request
            </Button>
          )}
        </div>

        {/* ── Search & filters bar ── */}
        <div className="req-toolbar">
          {/* Search */}
          <div className="req-search-wrap">
            <Search size={16} className="req-search-icon" />
            <input
              type="search"
              placeholder="Search requests…"
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="req-search"
              aria-label="Search requests"
            />
            {search && (
              <button className="req-search-clear" onClick={() => setParam('search', '')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="req-select-wrap">
            <ArrowUpDown size={14} className="req-select-icon" />
            <select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set('sort', e.target.value);
                setParams(next);
              }}
              className="req-select"
              aria-label="Sort requests"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Filter toggle (mobile) */}
          <button
            className={`req-filter-btn ${filtersOpen ? 'active' : ''}`}
            onClick={() => setFilters((v) => !v)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && <span className="req-filter-dot" />}
          </button>
        </div>

        {/* ── Inline filter chips ── */}
        <div className={`req-filters ${filtersOpen ? 'req-filters-open' : ''}`}>
          <div className="req-filter-group">
            <span className="req-filter-label">Category</span>
            <div className="req-chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`req-chip ${(category || 'All') === c ? 'req-chip-active' : ''}`}
                  onClick={() => setParam('category', c === 'All' ? '' : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="req-filter-group">
            <span className="req-filter-label">Status</span>
            <div className="req-chips">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`req-chip ${(status || 'All') === s ? 'req-chip-active' : ''}`}
                  onClick={() => setParam('status', s === 'All' ? '' : s)}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          {hasFilters && (
            <button className="req-clear-btn" onClick={clearFilters}>
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="req-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <RequestCardSkeleton key={i} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<Search size={32} />}
            title="No requests found"
            description={hasFilters ? 'Try adjusting your filters or search query.' : 'Be the first to post a request!'}
            action={
              hasFilters
                ? <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
                : isLoggedIn
                  ? <Button as={Link} to="/requests/new" leftIcon={<Plus size={14} />}>Post a Request</Button>
                  : <Button as={Link} to="/signup">Get Started</Button>
            }
          />
        ) : (
          <div className="req-grid">
            {requests.map((r) => (
              <RequestCard key={r._id} request={r} onAccept={handleAccept} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="req-pagination">
            <button
              className="req-page-btn"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.set('page', String(page - 1));
                setParams(next);
              }}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="req-page-nums">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '…'
                    ? <span key={`ellipsis-${i}`} className="req-page-ellipsis">…</span>
                    : <button
                        key={n}
                        className={`req-page-num ${n === page ? 'req-page-num-active' : ''}`}
                        onClick={() => {
                          const next = new URLSearchParams(params);
                          next.set('page', String(n));
                          setParams(next);
                        }}
                      >{n}</button>
                )}
            </div>

            <button
              className="req-page-btn"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.set('page', String(page + 1));
                setParams(next);
              }}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
