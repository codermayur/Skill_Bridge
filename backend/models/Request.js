import mongoose from 'mongoose';

const CATEGORIES = [
  'Programming',
  'Design',
  'Writing',
  'Marketing',
  'Tutoring',
  'Tech Support',
  'Data & Analytics',
  'Other',
];

const STATUS = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Request title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Other',
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'pending',
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    aiCategory: {
      type: String,
      default: null,
    },
    aiSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes for common query patterns
requestSchema.index({ requester: 1, createdAt: -1 });
requestSchema.index({ helper: 1, status: 1 });
requestSchema.index({ status: 1, createdAt: -1 });
requestSchema.index({ skills: 1 });
requestSchema.index({ category: 1, status: 1 });

// Text index for search
requestSchema.index({ title: 'text', description: 'text', skills: 'text' });

export const VALID_CATEGORIES = CATEGORIES;
export const VALID_STATUSES = STATUS;

const Request = mongoose.model('Request', requestSchema);
export default Request;
