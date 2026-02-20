import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRandomQuestions } from "./questionsData";
import "./PracticePage.css";

function MLPractice() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const [answered, setAnswered] = useState({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const randomQuestions = getRandomQuestions("machine-learning", 10);
    setQuestions(randomQuestions);
    setSelectedAnswers({});
    setShowResults({});
    setAnswered({});
    setCurrentIndex(0);
  };

  const handleOptionSelect = (optionId) => {
    if (!answered[currentIndex]) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentIndex]: optionId
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswers[currentIndex]) {
      alert("Please select an option first");
      return;
    }
    setShowResults({
      ...showResults,
      [currentIndex]: true
    });
    setAnswered({
      ...answered,
      [currentIndex]: true
    });
  };

  const handleSkip = () => {
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const moveToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((_, index) => {
      if (answered[index]) {
        const correctOption = questions[index].options.find(opt => opt.isCorrect);
        if (selectedAnswers[index] === correctOption.id) {
          correct++;
        }
      }
    });
    return correct;
  };

  const getAnswersArray = () => {
    return questions.map((question, index) => {
      const correctOption = question.options.find(opt => opt.isCorrect);
      return {
        questionId: question.id,
        selectedAnswer: selectedAnswers[index] || null,
        correctAnswer: correctOption.id,
        isCorrect: selectedAnswers[index] === correctOption.id,
      };
    });
  };

  useEffect(() => {
    const allAnswered = Object.keys(answered).length === questions.length && questions.length > 0;
    if (allAnswered) {
      const score = getScore();
      const answers = getAnswersArray();
      navigate("/Result", {
        state: {
          score,
          totalQuestions: questions.length,
          language: "Machine Learning",
          answers,
        },
      });
    }
  }, [answered, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="practice-container">
        <Link to="/" className="back-btn">
          ← Back to Home
        </Link>
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <div className="empty-title">Loading Questions...</div>
          <div className="empty-description">Please wait while we fetch your questions.</div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = answered[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
  const isCorrect = selectedAnswer === correctOption.id;
  const answeredCount = Object.keys(answered).length;

  return (
    <div className="practice-container">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>

      <div className="practice-header">
        <div className="header-left">
          <div className="header-title">Machine Learning 🤖</div>
          <span className="language-badge">Practice Mode</span>
        </div>
        <div className="header-right">
          <div className="stats-box">
            Questions: <span>{currentIndex + 1}/10</span>
          </div>
          <div className="stats-box">
            Answered: <span>{answeredCount}/10</span>
          </div>
          <button className="refresh-btn" onClick={loadQuestions}>
            🔄 Refresh Questions
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="questions-container">
          <div className={`question-card ${currentQuestion.difficulty}`}>
            <div className="question-header">
              <div className="question-number">Q{currentIndex + 1}</div>
              <span className={`question-difficulty difficulty-${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="question-title">{currentQuestion.title}</h2>
            <p className="question-description">{currentQuestion.description}</p>

            <div className="question-example">
              <div className="example-label">Code:</div>
              <pre>{currentQuestion.code}</pre>
            </div>

            <div className="question-example">
              <div className="example-label">Expected Output:</div>
              <pre>{currentQuestion.example}</pre>
            </div>

            <div className="options-container">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`option ${selectedAnswer === option.id ? "selected" : ""}
                    ${isAnswered && option.isCorrect ? "correct" : ""}
                    ${isAnswered && selectedAnswer === option.id && !option.isCorrect ? "incorrect" : ""}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={option.id}
                    checked={selectedAnswer === option.id}
                    onChange={() => handleOptionSelect(option.id)}
                    disabled={isAnswered}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>

            {isAnswered && (
              <div className={`result-message ${isCorrect ? "result-correct" : "result-incorrect"}`}>
                <span className="result-icon">{isCorrect ? "✅" : "❌"}</span>
                <div>
                  <strong>{isCorrect ? "Correct!" : "Incorrect"}</strong>
                  <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}

            <div className="action-buttons">
              {!isAnswered ? (
                <>
                  <button className="btn btn-submit" onClick={handleSubmit}>
                    Submit Answer
                  </button>
                  <button className="btn btn-skip" onClick={handleSkip}>
                    Skip Question
                  </button>
                </>
              ) : (
                <button className="btn btn-submit" onClick={moveToNext} style={{ flex: 1 }}>
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={moveToPrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <div className="pagination-info">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <button
            className="pagination-btn"
            onClick={moveToNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MLPractice;
