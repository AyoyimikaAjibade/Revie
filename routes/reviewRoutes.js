const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/**
 * Express Router Object
 */
const router = require('express').Router();

router.put('/mark-as-helpful/:id', reviewController.markHelpFul);

router.use(authController.protect);
router
  .route('/')
  .post(
    authController.restrictTo('user'),
    reviewController.uploadReviewImages,
    reviewController.uploadReviewVideo,
    reviewController.setUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .put(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getReview);
module.exports = router;
