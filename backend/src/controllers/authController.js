const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.json({ success: true, message: 'User registered successfully', userId: user._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  res.json(user);
};

exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    await user.save();
    res.json({ success: true, message: 'Profile updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
