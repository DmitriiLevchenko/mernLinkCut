const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
module.exports = (req, res, next) => {
  if (rea.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split("")[1]; // Bearer token
    if (!token) {
      res.status(401).json({ message: "No authorizated" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "Something went wrong" });
    next();
  }
};
