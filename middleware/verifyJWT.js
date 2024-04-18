const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Bearen token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; // [ 'Bearer ','token'][1] ==>  token
  //   console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // console.log(err,decoded)
    if (err) {
        console.log(err)
      return res.status(401).json({ message: "Invalid token" });
    }
    // console.log('====>',req.cookies)
    req.user = decoded.UserInfo.id;
    // console.log(decoded)
    // console.log(req.cookies);
    // console.log(req.cookies.jwt);
    next();
  });
};

module.exports = verifyJWT;
