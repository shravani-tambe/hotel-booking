const express = require("express");
const Comment = require("../model/comment.model");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

//creating a comment

router.post("/post-comment", verifyToken, async (req, res) => {
  try {
    const { comment, postId, user } = req.body;
    const newComment = new Comment({
      comment,
      user,
      postId,
    });
    await newComment.save();
    res.status(201).send({
      message: "Comment posted successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("An error occured while posting a new comment.", error);
    res
      .status(500)
      .send({ message: "An error occured while posting a new comment" });
  }
});

//get count of all comments

router.get("/total-comments", async (req, res) => {
  try {
    const totalComment = await Comment.countDocuments({});
    res.status(200).send({ message: "Total comments count", totalComment });
  } catch (error) {
    console.error("An error occured while getting the comment count.", error);
    res
      .status(500)
      .send({ message: "An error occured while posting a new comment" });
  }
});

module.exports = router;
