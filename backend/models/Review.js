import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
      unique: true, // one review per request
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

reviewSchema.index({ helper: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1 });

// After saving a review, update the helper's reputation score
reviewSchema.post('save', async function () {
  try {
    const Review = this.constructor;
    const User = (await import('./User.js')).default;

    const stats = await Review.aggregate([
      { $match: { helper: this.helper } },
      {
        $group: {
          _id: '$helper',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          totalRating: { $sum: '$rating' },
        },
      },
    ]);

    if (stats.length > 0) {
      const { avgRating, totalReviews, totalRating } = stats[0];
      await User.findByIdAndUpdate(this.helper, {
        'reputation.score': Math.round(avgRating * 10) / 10,
        'reputation.totalReviews': totalReviews,
        'reputation.totalRating': totalRating,
      });
    }
  } catch (err) {
    console.error('Failed to update helper reputation:', err);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
