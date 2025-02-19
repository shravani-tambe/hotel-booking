const express = require("express");
const router = express.Router();

//creating a comment

router.post("/post-comment", async (req, res) => {
  console.log(req.body);
});

module.exports = router;
