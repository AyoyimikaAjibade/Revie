const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/img/reviews');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `image-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerStorageV = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `video-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  //if (!req.files.videos || !req.files.images) return next();
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image or video! Please upload only images or videos.',
        400
      ),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadReviewImages = upload.array('images', 3);

const uploadV = multer({ storage: multerStorageV, fileFilter: multerFilter });
exports.uploadReviewVideo = uploadV.single('video');

exports.setUserId = (req, res, next) => {
  //Allow nested route
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  console.log(req.files);
  console.log(req.body);
  let review = new Review(req.body);
  if (review.helpful === true) {
    review.helpfulCount.push(1);
    review.helpfulCount = review.helpfulCount.length;
  } else if (review.helpful === false) {
    review.helpfulCount = review.helpfulCount.pop(1);
    if (review.helpCount > 1) review.helpfulCount.length = 0;
  }
  review = await review.save();
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().sort({ createdAt: -1, helpfulCount: -1 });

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.body);
  const review = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  review.helpfulCount = review.helpfulCount.length;
  review = await review.save();
  console.log(review.helpfulCount);
  console.log('REVIEWS', review);
  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.markHelpFul = catchAsync(async (req, res, next) => {
  if (
    req.body.review ||
    req.body.rating ||
    req.body.category ||
    req.body.apartmentAddresse
  ) {
    return next(
      new AppError("Pls signup at '/signup' to provide more reviews", 403)
    );
  }
  let review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      helpful: req.body.helpful,
    },

    {
      new: true,
    }
  );
  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
