const JWT = require("jsonwebtoken");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_REFRESH_EXPIRE, { expiresIn: "7d" });
};

const registerUser = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashPassword });
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.save();

    return res.status(201).json({
      message: "User register successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exisitngUser = await User.findOne({ email });

    if (!exisitngUser) {
      return res.status(401).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, exisitngUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invaild credentials" });
    }

    const accessToken = generateToken(exisitngUser._id);
    const refreshToken = generateRefreshToken(exisitngUser._id);

    res.status(200).json({
      message: "Login successfully",
      user: {
        id: exisitngUser._id,
        name: exisitngUser.name,
        email: exisitngUser.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }
  try {
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invaild Credentials" });
    }
    JWT.verify(refreshToken, process.env.JWT_REFRESH_EXPIRE, (err, decode) => {
      if (err) {
        return res.status(403).json({ message: "Invaild and expired token" });
      }
      const newAccessToken = generateToken(decode.id);
      const newRefreshToken = generateRefreshToken(decode.id);

      user.refreshToken = newRefreshToken;
      user.save();

      res.status(200).json({
        accessToken: newAccessToken,
        refreshAccessToken: newRefreshToken,
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, refreshAccessToken };
