// validator
const { validationResult } = require('express-validator');

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
};
