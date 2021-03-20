const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/**
 * Express Router Object
 */
const router = require('express').Router();

router.patch('/mark-as-helpful/:reviewId', reviewController.markHelpFul);

router.use(authController.protect);
router
  .route('/')
  .post(
    authController.restrictTo('user'),
    reviewController.uploadRevieMedia,
    reviewController.saveMediaToDB,
    reviewController.setUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:reviewId')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.uploadRevieMedia,
    reviewController.saveMediaToDB,
    reviewController.updateReview
  )
  .get(authController.protect, reviewController.getReview);
module.exports = router;
