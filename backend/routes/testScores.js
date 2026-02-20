import express from 'express';
import TestScore from '../models/TestScore.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';
import { testScoreEmail } from '../utils/emailTemplates.js';

const router = express.Router();

// @route   POST /api/testscores
// @desc    Submit test score
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { language, score, totalQuestions, answers } = req.body;

    if (!language || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'Please provide language, score, and totalQuestions',
      });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    // Create test score
    const testScore = await TestScore.create({
      user: req.user._id,
      language,
      score,
      totalQuestions,
      percentage,
      answers: answers || [],
    });

    // Update user's test scores array
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        testScores: {
          language,
          score,
          totalQuestions,
          date: new Date(),
        },
      },
    });

    // Send email with test score
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Test Results - ${language} - Skill Bridge`,
        html: testScoreEmail(
          req.user.fullName,
          language,
          score,
          totalQuestions,
          percentage
        ),
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Test score saved and email sent',
      data: testScore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/testscores
// @desc    Get user's test scores
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const testScores = await TestScore.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: testScores.length,
      data: testScores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/testscores/:language
// @desc    Get test scores for a specific language
// @access  Private
router.get('/:language', protect, async (req, res) => {
  try {
    const testScores = await TestScore.find({
      user: req.user._id,
      language: req.params.language,
    })
      .sort({ date: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: testScores.length,
      data: testScores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
