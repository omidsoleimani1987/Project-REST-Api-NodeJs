const express = require('express');

const { body } = require('express-validator');

// controllers
const feedController = require('../controllers/feed');

// router
const router = express.Router();

// fetch all posts
router.get('/posts', feedController.getPosts);

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

module.exports = router;
