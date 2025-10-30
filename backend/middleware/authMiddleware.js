const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const proctedRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorization, no token" });
  }
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodeToken.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invaild Token, please login again." });
    }
    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = { proctedRoute };
