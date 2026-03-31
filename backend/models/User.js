import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  testScores: [{
    language: String,
    score: Number,
    totalQuestions: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  }],

  // SaaS platform fields
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  reputation: {
    score: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
