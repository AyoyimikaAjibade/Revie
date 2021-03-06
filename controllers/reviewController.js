/**
 * @file recieves' incoming authenticated client request send back the appropriate
 * processed review data and resources solving business problems like checking if review is helpful,
 * CRUD on all review resources and  passing it down to the routes
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 * @since 0.1.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 1:37am>
 */

const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const filter = require('./userController');
const multer = require('multer');

//Setting the multer storage path and dynamic filename when succesfully uploaded
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, 'uploads/img/reviews');
    } else if (file.mimetype.startsWith('video')) {
      cb(null, 'uploads/videos');
    }
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (file.mimetype.startsWith('image')) {
      cb(null, `image-${req.user.id}-${Date.now()}.${ext}`);
    } else if (file.mimetype.startsWith('video')) {
      cb(null, `video-${req.user.id}-${Date.now()}.${ext}`);
    }
  },
});

//Filtering incoming file to only accept images or video
const multerFilter = (req, file, cb) => {
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
//Using the multer object to upload
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//setting the upload for multiple file and types
exports.uploadRevieMedia = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 },
]);

/**
 * A middleware to Set user id when user is logged in
 * from currrent user and user data not in the req.body
 */
exports.setUserId = (req, res, next) => {
  //Allow nested route
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * A middleware to save the uploaded media i.e video or image to
 * the review collections
 */
exports.saveMediaToDB = (req, res, next) => {
  if (req.files === undefined) return next();

  const images = [];
  for (let el of req.files.images) {
    if (el.mimetype.startsWith('image')) {
      images.push(el.filename);
      req.body.images = images;
    }
  }

  if (req.files.video[0].mimetype.startsWith('video'))
    req.body.video = req.files.video[0].filename;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
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
  review = await Review.findByIdAndDelete(req.params.reviewId);

  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);

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
  //Filtered out unwanted review data that are not allowed to be in the req.body
  const filterdBody = filter.filterObj(req.body, 'helpful');
  let review = await Review.findByIdAndUpdate(
    req.params.reviewId,
    filterdBody,
    {
      new: true,
      runValidators: true,
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
