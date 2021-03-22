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

// assign a function to the "methods" object of our reviewSchema
reviewSchema.methods.setHelpfulCount = function (cb) {
  console.log('HELLO FROM INSTANCE METHODS!');

  if (this.helpful === true) {
    this.helpfulCount = ++this.helpfulCount;
    // console.log(this.helpful);
    // console.log(this.helpfulCount);
    // console.log('true');
  }
  if (this.helpfulCount !== 0 && this.helpful === false) {
    this.helpfulCount = --this.helpfulCount;
    // console.log(this.helpful);
    // console.log(this.helpfulCount);
    // console.log('false');
  }
};

reviewSchema.pre('save', function (next) {
  this.setHelpfulCount();
  next();
});

reviewSchema.pre('findOneAndUpdate', async function (next) {
  console.log('HELLO FROM PRE find!');
  // The document that `findOneAndUpdate()` will modify
  const docToUpdate = await this.model.findOne(this.getQuery());
  //Another method of gaining access to the updated data before saving to database
  //this.docToUpdate = await this.findOne();
  // console.log('PRE', docToUpdate);
  docToUpdate.setHelpfulCount();
  //docToUpdate.save();
  //console.log('POST', docToUpdate);
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
