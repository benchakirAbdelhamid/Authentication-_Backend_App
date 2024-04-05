const express = require("express");
const mongoose = require("mongoose");
const cookiesParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/dbConnect");
const route = require("./routes/rout");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const corsOptions = require("./config/corsOptions");
const app = express();

const PORT = process.env.PORT || 5000;

// connect to Database
connectDB();

app.use(cors(corsOptions));
app.use(cookiesParser()); // ay ya9bal mini cookies
app.use(express.json()); // ay server yat3araf 3la json

// routes
app.use("/", route);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./view/404.html"));
  } else if (req.accepts("json")) {
    res.json({
      status: 404,
      message: "Page not found",
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// if successful connect to mongoDB , running server
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
});
// if failed connect to mongodb server
mongoose.connection.on("error", (err) => {
  console.log(err);
});
