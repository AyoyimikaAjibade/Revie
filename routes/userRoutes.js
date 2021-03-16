const userController = require('../controllers/userController');

const router = require('express').Router()

router
  .route('/')
  .get(userController.getAllUsers)


module.exports = router