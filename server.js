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

app.use(express.json()); // ay server yat3araf 3la json
app.use(cookiesParser()); // ay ya9bal mini cookies
// Middleware
// app.use(cors(corsOptions));
app.use(
  cors({
    credentials: true,
    // origin: "http://localhost:3000",
    origin: "https://authentication-frontend-app.vercel.app",
  })
);

// routes
app.use("/", route);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// test api ===============

app.get("/set-cookie", (req, res) => {
  res
    .cookie("myname", "my name is hamid benchakir", {
      maxAge: 600000,
      httpOnly: true,
    })
    // .send("Done");
  res.json({ messsage: "created successfully" });
});

app.get("/get-cookie", (req, res) => {
  res.send({ cookies: req.cookies, message: "get cookies" });
});

app.get("/delete-cookie", (req, res) => {
  res.clearCookie("myname")
  // .send("Done");
  res.json({ message: "success delete cookies" });
});

app.post("/test", (req, res) => {
  console.log(req.body);
  const mytoken = "my-secret-token-mytoken";
  // Set the cookie with an expiration (optional)
  res.cookie("mytoken", mytoken, {
    maxAge: 3500000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }); // 1 hour

  res.json({
    body: req.body,
    message: "Logged in successfully! Token set as a cookie.",
  });
});

app.get("/test", (req, res) => {
  // res.clearCookie("token");
  // res.clearCookie("mytoken");
  res.json({ message: "hello word test"});
  // res.json({ message: "hello word", cookies: req.cookies});
});
// test api ===============

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./view/404.html"));
  } else if (req.accepts("json")) {
    res.json({
      status: 404,
      message: "404 Page not found",
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
