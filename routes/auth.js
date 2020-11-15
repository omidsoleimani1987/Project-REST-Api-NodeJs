const express = require('express');

const { body } = require('express-validator');

// adding User model to check the existence of the email address
const User = require('../models/user');

// *********************************************************************************** //

// controllers
const authController = require('../controllers/auth');

// *********************************************************************************** //

// router
const router = express.Router();

// *********************************************************************************** //

// create new user
// extra check if the user email already exists - custom()
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty().escape()
  ],
  authController.signupUser
);

// *********************************************************************************** //

// user login route
router.post('/login', authController.loginUser);

// *********************************************************************************** //

module.exports = router;
