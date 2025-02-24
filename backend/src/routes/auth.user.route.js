const express = require("express");
const User = require("../model/user.model");
const router = express.Router();

//register a new user

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });

    await user.save();
    res
      .status(200)
      .send({ message: "User registration successful!", user: user });
    console.log(user);
  } catch (error) {
    console.error("Failed to register", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

//login a new user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    //generate a token here

    const token = await generateToken(user._id);

    res.status(200).send({
      message: "Login Successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ message: "Login failed! Try again." });
  }
});

module.exports = router;
