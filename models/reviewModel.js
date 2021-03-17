const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    trim: true,
    required: [true, 'Review cannot be empty'],
    unique: true,
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be  below 5.0'],
    default: 0,
  },
  images: [String],
  videos: [String],
  helpful: {
    type: Boolean,
    default: false,
  },
  helpfulCount: [{ type: Number, default: 0 }],
  category: {
    type: String,
    enum: ['landlords', 'environments', 'qualityOfAmenities'],
    message:
      'Category of review is either on landlords, environments, qualityOfAmenities',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  ],
  apartmentAddresse: {
    type: String,
    trim: true,
    required: [true, 'Review apartment must have an addresse.'],
  },
});

reviewSchema.index({ createdAt: 1, helpfulCount: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
