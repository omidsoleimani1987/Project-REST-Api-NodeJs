// validator
const { validationResult } = require('express-validator');

// import Post model
const Post = require('../models/post');

// send all posts
exports.getPosts = (req, res, next) => {
  // json is provided by express to return json data, passing normal object to the json and it convert it automatically

  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'fetched posts successfully',
        posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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

  // check is the file is set
  if (!req.file) {
    const message = 'No image provided!';
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace('\\', '/');

  // create a post with Post model as a constructor
  const post = new Post({
    // mongoose create the id and timestamps for us
    title,
    content,
    imageUrl,
    creator: {
      name: 'Omid'
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

// get single post
exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      // check if there is such a post in DB
      if (!post) {
        // adding express error handling
        const message = 'Could not find post.';
        const error = new Error(message);
        error.statusCode = 404;
        throw error;
      }

      // when there is a post with given postId
      res.status(200).json({
        message: 'Post fetched',
        post
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// update and edit a single post
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

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

  // to check if the image url is changed or request contains new file inside it
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }
  // if image url is not set
  if (!imageUrl) {
    const message = 'No file picked!';
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      // if we did not find the post
      if (!post) {
        const message = 'Could not find post.';
        const error = new Error(message);
        error.statusCode = 404;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then(result => {
      // when the post updated
      res.status(200).json({
        message: 'Post updated!',
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
