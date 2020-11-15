// file system package for helper function to delete the old image from folder for deleted or update post
const fs = require('fs');
const path = require('path');

// validator
const { validationResult } = require('express-validator');

// import Post model
const Post = require('../models/post');

// import User model
const User = require('../models/user');

// *********************************************************************************** //

// fetch all posts
exports.getPosts = (req, res, next) => {
  // json is provided by express to return json data, passing normal object to the json and it convert it automatically

  // * fetching data with pagination logic

  // page query parameter comes from frontend
  const currentPage = req.query.page || 1;

  // per page value is hard coded in frontend and backend
  const perPage = 2;

  // to determine how many items we have in database
  let totalItems;

  /// this promise just COUNT the documents not retrieve them
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;

      // calculate how many item to skip when we read and fetch from DB according the page we are in (in frontend)
      const skipItems = (currentPage - 1) * perPage;

      return Post.find().skip(skipItems).limit(perPage);
    })
    .then(posts => {
      res.status(200).json({
        message: 'fetched posts successfully',
        posts,
        totalItems
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  //................................
};

// *********************************************************************************** //

// create a post
exports.createPost = (req, res, next) => {
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

  // creator variable to pass later as extra information to frontend
  let creator;

  // TODO) we have user Id because in is-auth.js we stored our user Id in each request object
  // TODO) req.userId is a string but mongoose convert it objectId

  // create a post with Post model as a constructor
  const post = new Post({
    // mongoose create the id and timestamps for us
    title,
    content,
    imageUrl,
    creator: req.userId
  });

  // save to database
  post
    .save()
    .then(result => {
      // first we should find which user created this post
      return User.findById(req.userId);
    })
    .then(user => {
      // first we store the found user to creator variable to pass it in the nex then block to frontend
      creator = user;

      // after finding the user, adding the post to the list of posts for given user
      // TODO) we pass the all post object but mongoose takes just the userId and add it to the posts array
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully',
        // post object is result object that we get back here
        post,
        // ! passing extra info about creator to frontend
        creator: {
          _id: creator._id,
          name: creator.name
        }
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

// *********************************************************************************** //

// TODO) helper function to delete image from local folder
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    console.log(err);
  });
};

// *********************************************************************************** //

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

      // check if the user uploaded a new file for image to delete the old one
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
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

// *********************************************************************************** //

// delete single post
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  // we could use Post.findByIdAndRemove(), but we want to check if the current user is the creator of the post
  Post.findById(postId)
    .then(post => {
      // if we did not find the post
      if (!post) {
        const message = 'Could not find post.';
        const error = new Error(message);
        error.statusCode = 404;
        throw error;
      }

      //TODO) check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      // when the post deleted
      res.status(200).json({
        message: 'Post deleted!'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
