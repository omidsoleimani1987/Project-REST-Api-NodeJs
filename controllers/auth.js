// validator
const { validationResult } = require('express-validator');

// password encrypt
const bcrypt = require('bcryptjs');

// import User model
const User = require('../models/user');

// *********************************************************************************** //

// sign new user up - create new user
exports.signupUser = (req, res, next) => {
  // adding validator to incoming requests
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // adding express error handling
    const message = 'validation failed. Entered data is incorrect.';
    const error = new Error(message);
    error.statusCode = 422;
    error.data = errors.array(); // keeps original errors which is retrieved by validation package
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // encrypt password
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      // create new user based on User model
      const user = new User({
        email,
        name,
        password: hashedPassword
      });

      // save user in DB
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'User created successfully',
        // post object is result object that we get back here
        userId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
