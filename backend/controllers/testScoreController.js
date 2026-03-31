import * as testScoreService from '../services/testScoreService.js';

export const submitScore = async (req, res, next) => {
  try {
    const { language, score, totalQuestions, answers } = req.body;
    const data = await testScoreService.submitScore({
      userId: req.user._id,
      userEmail: req.user.email,
      userFullName: req.user.fullName,
      language,
      score,
      totalQuestions,
      answers,
    });
    res.status(201).json({ success: true, message: 'Test score saved and email sent', data });
  } catch (err) {
    next(err);
  }
};

export const getScores = async (req, res, next) => {
  try {
    const data = await testScoreService.getScores(req.user._id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

export const getScoresByLanguage = async (req, res, next) => {
  try {
    const data = await testScoreService.getScoresByLanguage(
      req.user._id,
      req.params.language
    );
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};
