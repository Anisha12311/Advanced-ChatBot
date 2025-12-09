const {
  registerUser,
  loginUser,
  user,
  refreshAccessToken,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");

const express = require("express");
const { proctedRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshAccessToken);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

module.exports = { router };
