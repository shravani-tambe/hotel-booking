const express = require("express");
const User = require("../model/user.model");
const router = express.Router();
const generateToken = require("../middleware/generateToken");

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
    res.status(500).json({ message: "Registration failed!" });
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
    res.cookie("token", token, {
      httpsOnly: true, //works only with https://
      secure: true,
      sameSite: true,
    });

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

//Logout a user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Failed to logout", error);
    res.status(500).json({ message: "Logout failed!" });
  }
});

//Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "Users found successfully", users });
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
});

// delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting the user", error);
    res.status(500).json({ message: "User deletion failed!" });
  }
});

//update a user role
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdandUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user role", error);
    res.status(500).json({ message: "User updation failed!" });
  }
});

module.exports = router;
