const express = require("express");
const { proctedRoute } = require("../middleware/authMiddleware");
const {
  getNotificaiton,
  deleteNotification,
  markAsReadNotification,
} = require("../controllers/message");

const messageRouter = express.Router();

messageRouter.get("/notification/:messageTo", proctedRoute, getNotificaiton);
messageRouter.delete("/notification/:_id", proctedRoute, deleteNotification);
messageRouter.patch(
  "/notification/read/:_id",
  proctedRoute,
  markAsReadNotification
);

module.exports = { messageRouter };
