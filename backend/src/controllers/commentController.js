const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = new Comment({
      user: req.user._id,
      post: post._id,
      comment,
    });
    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.json({ success: true, commentId: newComment._id, message: 'Comment added successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a comment from a post
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(req.params.postId);
    post.comments.pull(commentId);
    await post.save();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
