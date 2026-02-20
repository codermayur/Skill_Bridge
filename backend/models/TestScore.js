import mongoose from 'mongoose';

const testScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  answers: [{
    questionId: Number,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

const TestScore = mongoose.model('TestScore', testScoreSchema);

export default TestScore;
