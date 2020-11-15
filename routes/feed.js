const express = require('express');

const { body } = require('express-validator');

// *********************************************************************************** //

// importing the authentication token to validate the user before our important routes
const isAuth = require('../middleware/is-auth');

// *********************************************************************************** //

// controllers
const feedController = require('../controllers/feed');

// *********************************************************************************** //

// router
const router = express.Router();

// *********************************************************************************** //

// fetch all posts
router.get('/posts', isAuth, feedController.getPosts);

// *********************************************************************************** //

// create new post
// adding middleware array for validation
router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  feedController.createPost
);

// *********************************************************************************** //

// fetching a single post
router.get('/post/:postId', feedController.getSinglePost);

// *********************************************************************************** //

// updating the posts + adding validation to new values (we can have body for PUT too)
router.put(
  '/post/:postId',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  feedController.updatePost
);

// *********************************************************************************** //

// delete single post (we can NOT have body for DELETE)
router.delete('/post/:postId', feedController.deletePost);

// *********************************************************************************** //

module.exports = router;
