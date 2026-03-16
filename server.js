const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/instagramClone")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/signup", async (req,res)=>{
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

app.post("/login", async (req,res)=>{
  const user = await User.findOne(req.body);
  res.send(user);
});

app.post("/post", upload.single("image"), async (req,res)=>{
  const post = new Post({
    username: req.body.username,
    image: req.file.filename,
    likes: 0
  });
  await post.save();
  res.send(post);
});

app.get("/posts", async (req,res)=>{
  const posts = await Post.find().sort({_id:-1});
  res.send(posts);
});

app.post("/like/:id", async (req,res)=>{
  const post = await Post.findById(req.params.id);
  post.likes++;
  await post.save();
  res.send(post);
});

app.listen(3000, ()=>console.log("Server running on port 3000"));
