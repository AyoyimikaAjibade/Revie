/**
 * @file This file defines the Review schema, creates methods, middlewares,
 * instances available on the Review model functions and exports it as a model
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 10:02pm>
 * @since 0.1.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <30/12/2020 10:02pm>
 */

const mongoose = require('mongoose');
/**
 * @param {Object} Review - Schema that will be used to create the Review collection
 * @param {String} Review.review - The review text
 * @param {Number} Review.rating - The rating of the Review
 * @param {Array} Review.images - The images of the Review
 * @param {Array} Review.videos - The video of the Review
 * @param {Boolean} Review.helpful - The helpful status of the Review
 * @param {Number} Review.helpfulCount - The number of helpfulCount per a particular status of the Review
 * @param {String} Review.category - The category of each Review
 * @param {Date} Review.createdAt - The date a review is created
 * @param {Object} Review.user - The user information of author of the review
 * @param {String} Review.apartmentAddresse - The apartment location that has a review
 **/

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
  video: [String],
  helpful: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['landlords', 'environments', 'qualityOfAmenities'],
    required: [true, 'Review must belong to a category.'],

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
      ref: 'Review',
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

// assign a function to the "methods" object of our reviewSchema
reviewSchema.methods.setHelpfulCount = function (cb) {
  if (this.helpful === true) {
    this.helpfulCount = ++this.helpfulCount;
  }
  if (this.helpfulCount !== 0 && this.helpful === false) {
    this.helpfulCount = --this.helpfulCount;
  }
};

reviewSchema.pre('save', function (next) {
  this.setHelpfulCount();
  next();
});

reviewSchema.pre('findOneAndUpdate', async function (next) {
  // The document that `findOneAndUpdate()` will modify
  const docToUpdate = await this.model.findOne(this.getQuery());

  //Another method of gaining access to the updated data before saving to database
  //this.docToUpdate = await this.findOne();

  docToUpdate.setHelpfulCount();
  docToUpdate.save();
  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
