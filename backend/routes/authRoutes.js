const {
  registerUser,
  loginUser,
  user,
  refreshAccessToken,
} = require("../controllers/authController");

const express = require("express");
const { proctedRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshAccessToken);

module.exports = { router };
