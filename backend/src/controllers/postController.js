const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { stockSymbol, title, description, tags } = req.body;
    const post = new Post({
      user: req.user._id,
      stockSymbol,
      title,
      description,
      tags,
    });
    await post.save();
    res.json({ success: true, postId: post._id, message: 'Post created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all posts with optional filters and sorting
exports.getAllPosts = async (req, res) => {
  try {
    const { stockSymbol, tags, sortBy } = req.query;
    const sort = sortBy === 'likes' ? { likesCount: -1 } : { createdAt: -1 };

    const query = {};
    if (stockSymbol) query.stockSymbol = stockSymbol;
    if (tags) query.tags = { $in: tags.split(',') };

    const posts = await Post.find(query).sort(sort).populate('user', 'username').exec();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single post by ID with comments
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      })
      .exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
