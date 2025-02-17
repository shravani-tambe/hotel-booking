const express = require("express");
const router = express.Router();
const Blog = require("../model/blog.model");

router.post("/create-post", async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body });
    await newPost.save();
    res
      .status(201)
      .send({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post: ", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query; //request query gets split and stored in three vars

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
        ...query, //spread operator: takes all key value pairs in query and puts them in a new object copy
        category: category,
      };
    }

    if (location) {
      query = {
        ...query,
        location: location,
      };
    }

    const post = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).send({
      message: "All posts retrieved successfully",
      posts: post,
    });
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).send({ message: "Error creating post" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.status(200).send({
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    console.error("Error fetching single post", error);
    res.status(500).send({ message: "Error fetching single post" });
  }
});

module.exports = router;
