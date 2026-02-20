import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { testScoreAPI } from "../services/api";
import "./PracticePage.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { score, totalQuestions, language, answers } = location.state || {};
  const finalScore = score || 0;
  const total = totalQuestions || 10;
  const lang = language || "Unknown";
  const percentage = Math.round((finalScore / total) * 100);

  useEffect(() => {
    // Auto-submit score when component mounts
    if (score !== undefined && !submitted) {
      submitScore();
    }
  }, []);

  const submitScore = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      // User not logged in, skip submission
      return;
    }

    setIsSubmitting(true);
    try {
      await testScoreAPI.submitScore(lang, finalScore, total, answers || []);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit score:", error);
      // Don't show error to user, just continue
    } finally {
      setIsSubmitting(false);
    }
  };

  const performanceMessage =
    percentage >= 80 ? "Excellent! 🎉" :
    percentage >= 60 ? "Good Job! 👍" :
    percentage >= 40 ? "Keep Practicing! 💪" :
    "Try Again! 📚";

  return (
    <div className="practice-container">
      <div className="practice-header">
        <div className="header-left">
          <div className="header-title">{lang} Test Results</div>
          <span className="language-badge">Quiz Completed</span>
        </div>
      </div>

      <div className="main-content">
        <div className="results-card">
          <div className="results-header">
            <div className="performance-icon">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : "📊"}
            </div>
            <h2 className="results-title">{performanceMessage}</h2>
          </div>

          <div className="score-display">
            <div className="score-circle">
              <div className="score-percentage">{percentage}%</div>
              <div className="score-fraction">{finalScore} / {total}</div>
            </div>
          </div>

          <div className="results-stats">
            <div className="stat-item">
              <div className="stat-value">{finalScore}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{total - finalScore}</div>
              <div className="stat-label">Incorrect</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>

          {isSubmitting && (
            <div className="submission-status">
              <span className="loader"></span>
              <p>Saving your score...</p>
            </div>
          )}

          {submitted && (
            <div className="submission-success">
              <span>✓</span>
              <p>Score saved! Check your email for detailed results.</p>
            </div>
          )}

          <div className="results-actions">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Go Home
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/practice/${lang.toLowerCase()}`)}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
