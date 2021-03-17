/**
 * @file Handles all request in relation to users and authentications
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 05:37pm>
 * @since 1.0.0
 *  Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <02/01/2021 06:57am>
 */

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

/**
 * Express Router Object
 */
const router = require('express').Router();

/**
 * This route handles the POST verb for signin user to Revie
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.updateMe
);

// Restrict the manipulation of this routes resources for the admin alone
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
