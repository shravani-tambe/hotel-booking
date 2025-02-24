const express = require("express");
const Comment = require("../model/comment.model");

const router = express.Router();

//creating a comment

router.post("/post-comment", async (req, res) => {
  try {
    console.log(req.body);
    const newComment = new Comment(req.body);
    await newComment.save();

    res
      .status(200)
      .send({ mesage: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("An error occured while posting a new comment.", error);
    res
      .status(500)
      .send({ message: "An error occured while posting a new comment" });
  }
});

//get count of all comments

router.get("/total-comments", async(req, res) => {
  try {
    const totalComment = await Comment.countDocuments({}); 
    res.status(200).send({message: "Total comments count", totalComment})
  } catch (error) {
    console.error("An error occured while getting the comment count.", error);
    res
      .status(500)
      .send({ message: "An error occured while posting a new comment" });
  }  
})

module.exports = router;
