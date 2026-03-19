const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    messageFrom: {
      type: String,
      required: true,
    },
    messageTo: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
