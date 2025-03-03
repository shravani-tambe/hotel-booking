const express = require("express");
const Comment = require("../model/comment.model");
const Blog = require("../model/blog.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

//create a blog post
router.post("/create-post", verifyToken, isAdmin, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId });
    await newPost.save();
    res
      .status(201)
      .send({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post: ", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

//get all blogs
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query; //req query gets split and stored in three vars

    console.log(search);

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        //spread operator: takes all key value pairs in query and puts them in a new object copy
        category: category,
      };
    }

    if (location) {
      query = {
        ...query,
        location: location,
      };
    }

    const posts = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).send({ message: "Error creating post" });
  }
});

//get single blog by id

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comment = await Comment.find({ postId: postId }).populate(
      "user",
      "username email"
    );
    res.status(200).send({
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    console.error("Error fetching single post", error);
    res.status(500).send({ message: "Error fetching single post" });
  }
});

//update a blog post
router.patch("/update-post/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const updatePost = await Blog.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatePost) {
      return res.status(404).send({ message: "Post not found " });
    }

    res.status(200).send({
      message: "Post updated successfully",
      post: updatePost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send({ message: "Error updating post:" });
  }
});

//delete a blog post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    await Comment.deleteMany({ postId: postId });

    res.status(200).send({
      message: "Post deleted successfully",
      post: post,
    });
  } catch (error) {
    console.error("Error deleting post", error);
    res.status(500).send({ message: "Error deleting post" });
  }
});

//related posts
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Post id is required" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({ message: "Post ID is not found!" });
    }

    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");

    const relatedQuery = {
      _id: { $ne: id }, //exclude the current blog by id
      title: { $regex: titleRegex },
    };

    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({ message: "Related post found!", post: relatedPost });
  } catch (error) {
    console.error("Error fetching related post", error);
    res.status(500).send({ message: "Error fetching post" });
  }
});

module.exports = router;
