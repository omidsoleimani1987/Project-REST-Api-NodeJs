const express = require('express');

// controllers
const feedController = require('../controllers/feed');

// router
const router = express.Router();

// fetch all posts
router.get('/posts', feedController.getPosts);

// create new post
router.post('/post', feedController.createPost);

module.exports = router;
