const express = require('express');
const { createPost, getAllPosts, getPostById, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new post
router.post('/', authMiddleware, createPost);

// Get all posts with optional filters and sorting
router.get('/', getAllPosts);

// Get a single post by ID with comments
router.get('/:postId', getPostById);

// Delete a post
router.delete('/:postId', authMiddleware, deletePost);

module.exports = router;
