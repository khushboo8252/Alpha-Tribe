const express = require('express');
const { addComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router({ mergeParams: true });

// Add a comment to a post
router.post('/:postId/comments', authMiddleware, addComment);

// Delete a comment from a post
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
