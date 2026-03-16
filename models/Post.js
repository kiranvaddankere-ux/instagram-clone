const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: String,
  image: String,
  likes: Number
});

module.exports = mongoose.model("Post", PostSchema);
