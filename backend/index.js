const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

//username: shravanitambe
//password: ndKbn0azdLmTH6RG

async function main() {
  await mongoose.connect(
    "mongodb+srv://shravanitambe:ndKbn0azdLmTH6RG@mern-blog-cluster.fgwku.mongodb.net/mern-b;ph?retryWrites=true&w=majority&appName=mern-blog-cluster"
  );

  app.get("/", (req, res) => {
    res.send("hello world");
  });
}

main()
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on ${port}`);
});
