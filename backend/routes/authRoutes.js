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
const {
  allUsers,
  userProfile,
  profile,
  deleteProfile,
  profileById,
  userById,
} = require("../controllers/user");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/refreshToken", refreshAccessToken);
router.post("/auth/forgetPassword", forgetPassword);
router.post("/auth/resetPassword", resetPassword);
router.get("/allUsers", proctedRoute, allUsers);
router.get("/userById/:id", proctedRoute, userById);
router.put("/userProfile", proctedRoute, userProfile);
router.get("/profile", proctedRoute, profile);
router.get("/profile/:id", proctedRoute, profileById);
router.delete("/deleteProfile", proctedRoute, deleteProfile);

module.exports = { router };
