const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  // console.log(req.body.email)
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(201).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: hashedPassword,
  });
  // console.log(foundUser)


  // // create token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  // // refresh token
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // create the refresh token
  res
    .cookie("jwt", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // sameSite: "None",
      // secure: true,
    })


  // // save user
  const saveUser = await user.save();
  // res.json({saveUser,accessToken,user});
  res.status(201).json({
    accessToken: accessToken,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    message: "successfuly sign up" 
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(201).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(201).json({ message: "Invalid password" });
  }
  // create token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  // refresh token
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  // stoke token in cookies
  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // accessible anly by web server
    // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // sameSite: "None",
    // secure: true, // https
  });
  res.status(200).json({
    accessToken: accessToken,
    first_name: foundUser.first_name,
    last_name: foundUser.last_name,
    email: foundUser.email,
    message: "successfuly login"
  });
  // const cookies = req.cookies;
  // console.log(cookies);
  // console.log(req.cookies.jwt);
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies,req.user);
  if (!cookies?.jwt) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findById(decoded.UserInfo.id);
      if (!foundUser)
        return res.status(401).json({ message: "Unauthorized" });
      // // create new token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    // sameSite: "None",
    // secure: true, // bach tawsalo ghir fi https protocol
  });
  res.status(200).json({ message: "Logged out" });
};
module.exports = {
  register,
  login,
  refresh,
  logout,
};
