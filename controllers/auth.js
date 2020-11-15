// validator
const { validationResult } = require('express-validator');

// password encrypt
const bcrypt = require('bcryptjs');

// json web token generator
const jwt = require('jsonwebtoken');

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
      console.log(user); // ! ...............
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

// *********************************************************************************** //

// user Login
exports.loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser; // user which is found ion db

  // first check if this email address exists
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const message = 'A user with this email could not be found!';
        const error = new Error(message);
        error.statusCode = 401; // not authenticated
        throw error;
      }

      // if we have this email address, now we validate the email address
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      // if the given password by user is not equal to password in DB
      if (!isEqual) {
        const message = 'Entered password does not match!';
        const error = new Error(message);
        error.statusCode = 401; // not authenticated
        throw error;
      }

      //TODO) if password matches - we generate JWT (json web token)
      // sign() create a new signature and packs to new json token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretprivatekey',
        { expiresIn: '1h' }
      );

      // then we return the token to client
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// *********************************************************************************** //

// *********************************************************************************** //
