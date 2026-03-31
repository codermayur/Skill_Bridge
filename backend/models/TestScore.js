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
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
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

// Indexes for frequent query patterns
testScoreSchema.index({ user: 1, date: -1 });
testScoreSchema.index({ user: 1, language: 1, date: -1 });

const TestScore = mongoose.model('TestScore', testScoreSchema);

export default TestScore;
