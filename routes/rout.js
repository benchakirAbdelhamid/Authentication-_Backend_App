const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  //   res.send("Hello World!");
  console.log(path.join(__dirname)); // D:\my files\cours  nodeJS\exNodeJs\Full-srack-authentication\server\routes
  res.sendFile(path.join(__dirname, "../view/index.html"));
});

module.exports = router;
