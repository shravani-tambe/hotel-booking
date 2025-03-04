const express = require("express");
const Comment = require("../model/comment.model");
const Blog = require("../model/blog.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/admin");
const router = express.Router();

//create a blog post
router.post("/create-post", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, category, coverImg } = req.body;

    const newPost = new Blog({
      ...req.body,
      author: req.userId,
    });
    await newPost.save();
    res
      .status(201)
      .send({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ message: "Failed to create post" });
  }
});

//get all blogs (public route)
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;

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
        category,
      };
    }

    if (location) {
      query = {
        ...query,
        location,
      };
    }

    const posts = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ message: "Failed to fetch posts" });
  }
});

//get single blog by id
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Blog.findById(postId).populate(
      "author",
      "email username"
    );

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: postId }).populate(
      "user",
      "username email"
    );

    res.status(200).send({ post, comments });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send({ message: "Failed to fetch post" });
  }
});

//update a blog post
router.patch("/update-post/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send({ message: "Failed to fetch post" });
  }
});

//delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    //delete related comments
    await Comment.deleteMany({ postId: postId });

    res.status(200).send({
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ message: "Failed to delete post" });
  }
});

//related posts
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({ message: "Blog post not found" });
    }

    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");

    const relatedQuery = {
      _id: { $ne: id },
      title: { $regex: titleRegex },
    };

    const relatedPosts = await Blog.find(relatedQuery);

    res.status(200).send(relatedPosts);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    res.status(500).send({ message: "Failed to fetch related posts" });
  }
});

module.exports = router;
