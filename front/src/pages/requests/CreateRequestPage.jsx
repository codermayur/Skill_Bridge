import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Tag, X, Sparkles, AlertCircle } from 'lucide-react';
import { requestAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import '../../components/ui/Button.css';
import './CreateRequestPage.css';

const CATEGORIES = ['Programming','Design','Writing','Marketing','Tutoring','Tech Support','Data & Analytics','Other'];
const COMMON_SKILLS = ['JavaScript','Python','React','Node.js','Java','CSS','SQL','Figma','Photoshop','Excel','SEO','Machine Learning','Docker','TypeScript'];

const STEPS = [
  { id: 1, label: 'Title',       description: 'Name your request'           },
  { id: 2, label: 'Description', description: 'Explain what you need'       },
  { id: 3, label: 'Category',    description: 'Classify your request'       },
  { id: 4, label: 'Skills',      description: 'What skills are needed?'     },
  { id: 5, label: 'Review',      description: 'Confirm and submit'          },
];

function StepIndicator({ current, total }) {
  return (
    <div className="cr-steps">
      {STEPS.map((s, i) => {
        const state = s.id < current ? 'done' : s.id === current ? 'active' : 'pending';
        return (
          <div key={s.id} className="cr-step-item">
            <div className={`cr-step-circle cr-step-${state}`}>
              {state === 'done' ? <Check size={14} strokeWidth={3} /> : <span>{s.id}</span>}
            </div>
            <span className={`cr-step-label ${state === 'active' ? 'cr-step-label-active' : ''}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`cr-step-line ${state === 'done' ? 'cr-step-line-done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreateRequestPage() {
  const navigate  = useNavigate();
  const { isLoggedIn } = useAuth();
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState({ title: '', description: '', skills: [], category: 'Other' });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [aiTip, setAiTip]           = useState(null);

  useEffect(() => { if (!isLoggedIn) navigate('/login'); }, [isLoggedIn, navigate]);

  /* ── Validation per step ─────────────────────────── */
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.title.trim() || form.title.trim().length < 5)
        e.title = 'Title must be at least 5 characters';
    }
    if (step === 2) {
      if (!form.description.trim() || form.description.trim().length < 20)
        e.description = 'Description must be at least 20 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 1)); };

  /* ── Skill helpers ───────────────────────────────── */
  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 10)
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput('');
  };
  const removeSkill = (s) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  /* ── AI tip ──────────────────────────────────────── */
  const getAiTip = () => {
    const tips = [
      'Be specific about the technology version — e.g. "React 18" instead of just "React".',
      'Mention the expected time commitment so helpers can plan accordingly.',
      'Include any error messages or logs if this is a debugging request.',
      'Describe your skill level — beginners and experts need different explanations.',
    ];
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  /* ── Submit ──────────────────────────────────────── */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await requestAPI.create(form);
      navigate(`/requests/${res.data._id}`);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to post request' });
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="cr-page">
      <div className="cr-card">
        {/* Header */}
        <div className="cr-header">
          <div>
            <h1 className="cr-title">Post a Help Request</h1>
            <p className="cr-subtitle">Step {step} of {STEPS.length} — {STEPS[step - 1].description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="cr-progress-bar">
          <div className="cr-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} total={STEPS.length} />

        {/* ── Step 1: Title ── */}
        {step === 1 && (
          <div className="cr-step-content animate-fade-in">
            <label className="cr-label" htmlFor="title">
              What do you need help with?
            </label>
            <input
              id="title"
              className={`cr-input ${errors.title ? 'cr-input-error' : ''}`}
              placeholder="e.g. Fix a React state management bug in my app"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              maxLength={120}
              autoFocus
            />
            {errors.title && <p className="cr-error"><AlertCircle size={13} />{errors.title}</p>}
            <p className="cr-hint">{form.title.length}/120 characters · Be specific and clear</p>
          </div>
        )}

        {/* ── Step 2: Description ── */}
        {step === 2 && (
          <div className="cr-step-content animate-fade-in">
            <div className="cr-label-row">
              <label className="cr-label" htmlFor="desc">Describe your request in detail</label>
              <button className="cr-ai-btn" type="button" onClick={getAiTip}>
                <Sparkles size={13} /> AI Tip
              </button>
            </div>
            {aiTip && (
              <div className="cr-ai-tip animate-fade-in">
                <Sparkles size={14} />
                <span>{aiTip}</span>
                <button onClick={() => setAiTip(null)}><X size={13} /></button>
              </div>
            )}
            <textarea
              id="desc"
              className={`cr-textarea ${errors.description ? 'cr-input-error' : ''}`}
              placeholder="Provide context, what you've already tried, expected vs actual behavior, code snippets if relevant…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              maxLength={2000}
            />
            {errors.description && <p className="cr-error"><AlertCircle size={13} />{errors.description}</p>}
            <p className="cr-hint">{form.description.length}/2000 characters · Min 20</p>
          </div>
        )}

        {/* ── Step 3: Category ── */}
        {step === 3 && (
          <div className="cr-step-content animate-fade-in">
            <label className="cr-label">Choose a category</label>
            <div className="cr-category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cr-category-btn ${form.category === cat ? 'cr-category-active' : ''}`}
                  onClick={() => setForm({ ...form, category: cat })}
                >
                  {form.category === cat && <Check size={14} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Skills ── */}
        {step === 4 && (
          <div className="cr-step-content animate-fade-in">
            <label className="cr-label">What skills are needed?</label>
            <div className="cr-skill-input-wrap">
              <Tag size={16} className="cr-skill-icon" />
              <input
                className="cr-skill-input"
                placeholder="Type a skill and press Enter…"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
              />
            </div>

            {/* Selected skills */}
            {form.skills.length > 0 && (
              <div className="cr-skills-list">
                {form.skills.map((s) => (
                  <span key={s} className="cr-skill-tag">
                    {s}
                    <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div className="cr-skill-suggestions">
              <p className="cr-hint" style={{ marginBottom: '0.5rem' }}>Quick add:</p>
              <div className="cr-suggestion-chips">
                {COMMON_SKILLS.filter((s) => !form.skills.includes(s)).map((s) => (
                  <button key={s} className="cr-suggestion-chip" type="button" onClick={() => addSkill(s)}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
            <p className="cr-hint">{form.skills.length}/10 skills added</p>
          </div>
        )}

        {/* ── Step 5: Review ── */}
        {step === 5 && (
          <div className="cr-step-content animate-fade-in">
            <h2 className="cr-review-title">Review your request</h2>

            <div className="cr-review-block">
              <span className="cr-review-label">Title</span>
              <p className="cr-review-value">{form.title}</p>
            </div>

            <div className="cr-review-block">
              <span className="cr-review-label">Description</span>
              <p className="cr-review-value">{form.description}</p>
            </div>

            <div className="cr-review-row">
              <div className="cr-review-block">
                <span className="cr-review-label">Category</span>
                <p className="cr-review-value">{form.category}</p>
              </div>
              <div className="cr-review-block">
                <span className="cr-review-label">Skills</span>
                <div className="cr-review-skills">
                  {form.skills.length > 0
                    ? form.skills.map((s) => <span key={s} className="tag">{s}</span>)
                    : <span className="cr-review-value" style={{ color: 'var(--text-muted)' }}>None specified</span>
                  }
                </div>
              </div>
            </div>

            {errors.submit && (
              <p className="cr-error"><AlertCircle size={13} />{errors.submit}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="cr-nav">
          {step > 1 ? (
            <Button variant="outline" size="md" onClick={back} leftIcon={<ChevronLeft size={16} />}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <Button size="md" onClick={next} rightIcon={<ChevronRight size={16} />}>
              Continue
            </Button>
          ) : (
            <Button size="md" loading={loading} onClick={handleSubmit}>
              Post Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
