const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file

const connect = () => {
  return mongoose.connect(process.env.MONGODB_URL);
};

module.exports = connect;