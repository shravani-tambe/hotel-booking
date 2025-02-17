const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// parse optiom
app.use(express.json());
app.use(cors());

// import Routes
const blogRoutes = require("./src/routes/blog.route");
app.use("/api/blogs", blogRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully!");

    app.use("/api/blogs", blogRoutes);

    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    // start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

main();
