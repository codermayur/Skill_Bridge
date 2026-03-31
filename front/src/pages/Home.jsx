import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, Code2, BookOpen, Users, Trophy,
  Star, TrendingUp, Shield, Clock, CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import '../components/ui/Button.css';
import './Home.css';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: '#F7DF1E', path: '/practice/javascript', difficulty: 'Beginner'    },
  { id: 'python',     name: 'Python',     icon: '🐍', color: '#3776AB', path: '/practice/python',     difficulty: 'Beginner'    },
  { id: 'java',       name: 'Java',       icon: '☕', color: '#ED8B00', path: '/practice/java',       difficulty: 'Intermediate' },
  { id: 'cpp',        name: 'C++',        icon: '⚙️', color: '#00599C', path: '/practice/cpp',        difficulty: 'Advanced'    },
  { id: 'react',      name: 'React',      icon: '⚛️', color: '#61DAFB', path: '/practice/react',      difficulty: 'Intermediate' },
  { id: 'sql',        name: 'SQL',        icon: '🗄️', color: '#336791', path: '/practice/sql',        difficulty: 'Beginner'    },
  { id: 'dsa-java',   name: 'DSA Java',   icon: '📊', color: '#ED8B00', path: '/practice/dsa-java',   difficulty: 'Advanced'    },
  { id: 'dsa-python', name: 'DSA Python', icon: '🐍', color: '#4B8BBE', path: '/practice/dsa-python', difficulty: 'Advanced'    },
  { id: 'dsa-cpp',    name: 'DSA C++',    icon: '⚙️', color: '#00599C', path: '/practice/dsa-cpp',    difficulty: 'Advanced'    },
  { id: 'machine-learning', name: 'ML',   icon: '🤖', color: '#FF6F00', path: '/practice/machine-learning', difficulty: 'Advanced' },
  { id: 'data-analytics',   name: 'Data Analytics', icon: '📈', color: '#20B2AA', path: '/practice/data-analytics', difficulty: 'Intermediate' },
];

const DIFFICULTY_COLORS = {
  Beginner:    { color: '#10b981', bg: 'rgba(16,185,129,.12)' },
  Intermediate:{ color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  Advanced:    { color: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
};

const STATS = [
  { value: '500+', label: 'Practice Problems',  icon: <Code2    size={22} /> },
  { value: '11',   label: 'Languages & Topics', icon: <BookOpen size={22} /> },
  { value: '10K+', label: 'Learners',           icon: <Users    size={22} /> },
  { value: '4.9★', label: 'Avg. Rating',        icon: <Trophy   size={22} /> },
];

const FEATURES = [
  { icon: <Zap size={20} />,         title: 'AI-Powered Matching',    desc: 'Smart algorithms connect you with the perfect helper for your request.' },
  { icon: <Shield size={20} />,      title: 'Verified Helpers',       desc: 'All helpers are rated and reviewed by the community for quality assurance.' },
  { icon: <Clock size={20} />,       title: 'Fast Responses',         desc: 'Average response time under 30 minutes with real-time chat.' },
  { icon: <Star size={20} />,        title: 'Reputation System',      desc: 'Build your reputation by helping others and earn badges.' },
  { icon: <TrendingUp size={20} />,  title: 'Track Progress',         desc: 'Monitor your learning journey with detailed analytics and insights.' },
  { icon: <CheckCircle size={20} />, title: 'Free to Use',            desc: 'Core features are completely free. No hidden fees, no subscriptions.' },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isLoggedIn } = useAuth();

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <div className="home-hero-orb home-hero-orb-1" />
          <div className="home-hero-orb home-hero-orb-2" />
          <div className="home-hero-grid" />
        </div>

        <div className="home-hero-content container">
          <div className="home-hero-badge animate-fade-in">
            <Zap size={12} />
            AI-Powered Skill Exchange Platform
          </div>

          <h1 className="home-hero-title animate-fade-in-up">
            Learn Faster.<br />
            <span className="gradient-text">Help Others Grow.</span>
          </h1>

          <p className="home-hero-subtitle animate-fade-in-up">
            Post a help request, practice coding with 500+ curated problems,
            and connect with skilled peers — all in one place.
          </p>

          <div className="home-hero-actions animate-fade-in-up">
            {isLoggedIn ? (
              <>
                <Button as={Link} to="/requests/new" size="lg" leftIcon={<Plus size={18} />}>
                  Post a Request
                </Button>
                <Button as={Link} to="/requests" size="lg" variant="outline" rightIcon={<ArrowRight size={16} />}>
                  Browse Requests
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/signup" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Get Started Free
                </Button>
                <Button as={Link} to="/login" size="lg" variant="outline">
                  Sign In
                </Button>
              </>
            )}
          </div>

          <div className="home-hero-social-proof animate-fade-in">
            <div className="home-avatar-stack">
              {['A','B','C','D'].map((l, i) => (
                <div key={l} className="home-avatar-item" style={{ '--i': i, '--c': ['#6366f1','#8b5cf6','#10b981','#f59e0b'][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <span>Join <strong>10,000+</strong> developers already learning</span>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="home-stats section-sm">
        <div className="container">
          <div className="home-stats-grid stagger-children">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="home-stat-card">
                <div className="home-stat-icon">{icon}</div>
                <div>
                  <div className="home-stat-value">{value}</div>
                  <div className="home-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice Topics ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Practice by Topic</h2>
              <p className="home-section-subtitle">
                700+ curated problems across 11 languages & specializations
              </p>
            </div>
            <Button as={Link} to="/" variant="ghost" size="sm" rightIcon={<ChevronRight size={15} />}>
              View all
            </Button>
          </div>

          <div className="home-lang-grid">
            {LANGUAGES.map((lang) => {
              const diff = DIFFICULTY_COLORS[lang.difficulty];
              const isHovered = hoveredCard === lang.id;
              return (
                <Link
                  key={lang.id}
                  to={lang.path}
                  className="home-lang-card"
                  style={{ '--card-color': lang.color }}
                  onMouseEnter={() => setHoveredCard(lang.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  aria-label={`Practice ${lang.name}`}
                >
                  <div className="home-lang-card-inner">
                    <span className="home-lang-icon">{lang.icon}</span>
                    <div className="home-lang-info">
                      <span className="home-lang-name">{lang.name}</span>
                      <span
                        className="home-lang-difficulty"
                        style={{ color: diff.color, background: diff.bg }}
                      >
                        {lang.difficulty}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="home-lang-arrow"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="section home-features-section">
        <div className="container">
          <div className="home-section-header center">
            <h2 className="home-section-title">Everything you need to level up</h2>
            <p className="home-section-subtitle">
              A complete platform for learning, helping, and connecting with developers.
            </p>
          </div>

          <div className="home-features-grid stagger-children">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="home-feature-card">
                <div className="home-feature-icon">{icon}</div>
                <h3 className="home-feature-title">{title}</h3>
                <p className="home-feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="home-cta">
            <div className="home-cta-bg" />
            <div className="home-cta-content">
              <h2 className="home-cta-title">Ready to start your journey?</h2>
              <p className="home-cta-subtitle">
                Join thousands of developers practising daily and helping each other grow.
              </p>
              <div className="home-cta-actions">
                <Button
                  as={Link}
                  to={isLoggedIn ? '/requests' : '/signup'}
                  size="lg"
                  rightIcon={<ArrowRight size={16} />}
                >
                  {isLoggedIn ? 'Explore Requests' : 'Start for Free'}
                </Button>
                <Button as={Link} to="/requests" size="lg" variant="ghost" style={{ color: '#a5b4fc' }}>
                  Browse Requests →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inline Plus icon for JSX usage above
function Plus({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}
