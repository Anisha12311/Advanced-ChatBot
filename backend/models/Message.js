const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
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
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "SEEN"],
      default: "SENT",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = { Message };
