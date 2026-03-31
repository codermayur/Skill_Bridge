import TestScore from '../models/TestScore.js';

export const createScore = (data) =>
  TestScore.create(data);

export const findByUser = (userId, limit = 50) =>
  TestScore.find({ user: userId }).sort({ date: -1 }).limit(limit);

export const findByUserAndLanguage = (userId, language, limit = 20) =>
  TestScore.find({ user: userId, language }).sort({ date: -1 }).limit(limit);

export const getLanguageStats = async (userId) => {
  return TestScore.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$language',
        avgPercentage: { $avg: '$percentage' },
        totalAttempts: { $sum: 1 },
        bestScore: { $max: '$percentage' },
      },
    },
    { $sort: { avgPercentage: -1 } },
  ]);
};
