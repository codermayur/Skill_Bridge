import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomQuestions } from "../pages/questionsData";

/**
 * Shared quiz hook that drives all practice pages.
 *
 * @param {string} languageKey - Key into questionsDatabase (e.g. "javascript")
 * @param {string} languageLabel - Display name shown in the result page
 * @param {number} questionCount - How many questions to load (default 10)
 */
export function useQuiz(languageKey, languageLabel, questionCount = 10) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const [answered, setAnswered] = useState({});

  const loadQuestions = useCallback(() => {
    const q = getRandomQuestions(languageKey, questionCount);
    setQuestions(q);
    setSelectedAnswers({});
    setShowResults({});
    setAnswered({});
    setCurrentIndex(0);
  }, [languageKey, questionCount]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleOptionSelect = (optionId) => {
    if (!answered[currentIndex]) {
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    }
  };

  const handleSubmit = () => {
    const selected = selectedAnswers[currentIndex];
    if (!selected) return false;

    const newShowResults = { ...showResults, [currentIndex]: true };
    const newAnswered = { ...answered, [currentIndex]: true };
    setShowResults(newShowResults);
    setAnswered(newAnswered);

    // Auto-navigate to Result once every question is answered
    const totalAnswered = Object.keys(newAnswered).length;
    if (totalAnswered === questionCount) {
      const score = questions.reduce((acc, q, idx) => {
        const correct = q.options.find((o) => o.isCorrect);
        return acc + (selectedAnswers[idx] === correct?.id ? 1 : 0);
      }, 0);

      const answersArray = questions.map((q, idx) => {
        const correct = q.options.find((o) => o.isCorrect);
        return {
          questionId: q.id,
          selectedAnswer: selectedAnswers[idx] || null,
          correctAnswer: correct?.id || null,
          isCorrect: selectedAnswers[idx] === correct?.id,
        };
      });

      navigate("/Result", {
        state: { score, totalQuestions: questionCount, language: languageKey, answers: answersArray },
      });
    }

    return true;
  };

  const handleSkip = () => moveToNext();

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const moveToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const currentQuestion = questions[currentIndex] || null;
  const isAnswered = !!answered[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const correctOption = currentQuestion?.options?.find((o) => o.isCorrect);
  const isCorrect = selectedAnswer === correctOption?.id;
  const answeredCount = Object.keys(answered).length;

  return {
    questions,
    currentIndex,
    currentQuestion,
    answeredCount,
    isAnswered,
    selectedAnswer,
    isCorrect,
    correctOption,
    handleOptionSelect,
    handleSubmit,
    handleSkip,
    moveToNext,
    moveToPrevious,
    loadQuestions,
  };
}
