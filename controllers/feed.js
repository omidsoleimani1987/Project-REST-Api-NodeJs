// validator
const { validationResult } = require('express-validator');

// import Post model
const Post = require('../models/post');

// send all posts
exports.getPosts = (req, res, next) => {
  // return a json response
  // json is provided by express to return json data
  // passing normal object to the json and it convert it automatically
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post content',
        imageUrl: 'images/bootstrap.jpg',
        creator: {
          name: 'omid'
        },
        createdAt: new Date()
      }
    ]
  });
};

// create a post
exports.createPost = (req, res, next) => {
  // adding validator to incoming requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // adding express error handling
    const message = 'validation failed. entered data is incorrect.';
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  // create a post with Post model as a constructor
  const post = new Post({
    // mongoose create the id and timestamps for us
    title,
    content,
    imageUrl: 'images/bootstrap.jpg',
    creator: {
      name: 'omid'
    }
  });

  // save to database
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully',
        // post object is result object that we get back here
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
