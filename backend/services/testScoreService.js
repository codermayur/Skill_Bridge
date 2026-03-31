import * as testScoreRepo from '../repositories/testScoreRepository.js';
import * as userRepo from '../repositories/userRepository.js';
import sendEmail from '../utils/sendEmail.js';
import { testScoreEmail } from '../utils/emailTemplates.js';

export const submitScore = async ({ userId, language, score, totalQuestions, answers, userEmail, userFullName }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const testScore = await testScoreRepo.createScore({
    user: userId,
    language,
    score,
    totalQuestions,
    percentage,
    answers,
  });

  // Mirror to embedded array on User document (fire-and-forget; tolerate failure)
  userRepo.updateById(userId, {
    $push: {
      testScores: { language, score, totalQuestions, date: new Date() },
    },
  }).catch((err) => console.error('Failed to update user.testScores array:', err));

  // Send result email (non-blocking)
  sendEmail({
    email: userEmail,
    subject: `Test Results - ${language} - Skill Bridge`,
    html: testScoreEmail(userFullName, language, score, totalQuestions, percentage),
  }).catch((err) => console.error('Failed to send score email:', err));

  return testScore;
};

export const getScores = (userId) =>
  testScoreRepo.findByUser(userId, 50);

export const getScoresByLanguage = (userId, language) =>
  testScoreRepo.findByUserAndLanguage(userId, language, 20);
