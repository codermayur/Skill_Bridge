/**
 * SharedPracticePage — single component that powers all language practice pages.
 *
 * Problem solved: 9 practice files had ~200 lines of identical quiz logic each (~1800 lines total).
 * This component + the useQuiz hook replace all of that with one source of truth.
 * Each practice page is now a 5-line wrapper that passes language/title/emoji as props.
 */
import { Link } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import "./SharedPracticePage.css";

export default function SharedPracticePage({ language, title, emoji }) {
  const {
    questions,
    currentIndex,
    currentQuestion,
    answeredCount,
    isAnswered,
    selectedAnswer,
    isCorrect,
    handleOptionSelect,
    handleSubmit,
    handleSkip,
    moveToNext,
    moveToPrevious,
    loadQuestions,
  } = useQuiz(language, title);

  const totalQuestions = questions.length;

  if (!currentQuestion) {
    return (
      <div className="sp-container">
        <Link to="/" className="sp-back-btn">← Back to Home</Link>
        <div className="sp-loading">
          <div className="sp-loading-icon">⚡</div>
          <p className="sp-loading-title">Loading Questions…</p>
        </div>
      </div>
    );
  }

  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="sp-container">
      <Link to="/" className="sp-back-btn">← Back to Home</Link>

      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-header-left">
          <h1 className="sp-lang-title">{title} <span>{emoji}</span></h1>
          <span className="sp-badge">Practice Mode</span>
        </div>
        <div className="sp-header-right">
          <div className="sp-stat">Question <strong>{currentIndex + 1}/{totalQuestions}</strong></div>
          <div className="sp-stat">Answered <strong>{answeredCount}/{totalQuestions}</strong></div>
          <button className="sp-refresh-btn" onClick={loadQuestions}>🔄 New Set</button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="sp-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className="sp-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* ── Question Card ── */}
      <div className={`sp-card sp-card--${currentQuestion.difficulty}`}>
        <div className="sp-card-header">
          <span className="sp-q-number">Q{currentIndex + 1}</span>
          <span className={`sp-difficulty sp-difficulty--${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        <h2 className="sp-q-title">{currentQuestion.title}</h2>
        <p className="sp-q-desc">{currentQuestion.description}</p>

        {currentQuestion.code && (
          <div className="sp-code-block">
            <div className="sp-code-label">Code</div>
            <pre><code>{currentQuestion.code}</code></pre>
          </div>
        )}

        {currentQuestion.example && (
          <div className="sp-code-block sp-code-block--output">
            <div className="sp-code-label">Expected Output</div>
            <pre><code>{currentQuestion.example}</code></pre>
          </div>
        )}

        {/* ── Options ── */}
        <div className="sp-options">
          {currentQuestion.options.map((option) => {
            let cls = "sp-option";
            if (selectedAnswer === option.id) cls += " sp-option--selected";
            if (isAnswered && option.isCorrect) cls += " sp-option--correct";
            if (isAnswered && selectedAnswer === option.id && !option.isCorrect) cls += " sp-option--incorrect";
            return (
              <label key={option.id} className={cls}>
                <input
                  type="radio"
                  name={`q-${currentIndex}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                />
                <span>{option.text}</span>
                {isAnswered && option.isCorrect && <span className="sp-option-tick">✓</span>}
                {isAnswered && selectedAnswer === option.id && !option.isCorrect && <span className="sp-option-tick">✗</span>}
              </label>
            );
          })}
        </div>

        {/* ── Result Feedback ── */}
        {isAnswered && (
          <div className={`sp-feedback sp-feedback--${isCorrect ? "correct" : "incorrect"}`}>
            <span className="sp-feedback-icon">{isCorrect ? "✅" : "❌"}</span>
            <div>
              <strong>{isCorrect ? "Correct!" : "Incorrect"}</strong>
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="sp-actions">
          {!isAnswered ? (
            <>
              <button
                className="sp-btn sp-btn--primary"
                onClick={() => {
                  if (!selectedAnswer) {
                    // Shake the options to signal "pick one first"
                    return;
                  }
                  handleSubmit();
                }}
                disabled={!selectedAnswer}
              >
                Submit Answer
              </button>
              <button className="sp-btn sp-btn--secondary" onClick={handleSkip}>
                Skip
              </button>
            </>
          ) : (
            <button className="sp-btn sp-btn--primary sp-btn--full" onClick={moveToNext}>
              {currentIndex === totalQuestions - 1 ? "Finish Quiz →" : "Next Question →"}
            </button>
          )}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="sp-pagination">
        <button
          className="sp-page-btn"
          onClick={moveToPrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        <div className="sp-page-dots">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`sp-dot ${i === currentIndex ? "sp-dot--active" : ""}`}
            />
          ))}
        </div>
        <button
          className="sp-page-btn"
          onClick={moveToNext}
          disabled={currentIndex === totalQuestions - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
