const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { configDB } = require("./config/db");
const { router } = require("./routes/authRoutes");
const { generateSnowflakeId } = require("./lib/snowflake-id");
const { Message } = require("./models/Message");
const http = require("http");
const { Server } = require("socket.io");
const { User } = require("./models/User");
const { Notification } = require("./models/Notification");
const { UserProfile } = require("./models/UserProfile");
const { messageRouter } = require("./routes/messageRoutes");

dotenv.config();
configDB();

const corsOrigin = {
  origin: "http://localhost:3000",
};

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors(corsOrigin));
app.use("/api", router);
app.use("/message", messageRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
const chatUsers = new Map();
const userCache = new Map();
const userProfile = new Map();

io.on("connection", (socket) => {
  console.log("socket id", socket.id);

  socket.on("join", async (userId) => {
    if (!userId) return;

    const uid = String(userId);

    if (!onlineUsers.has(uid)) {
      onlineUsers.set(uid, new Set());
    }

    onlineUsers.get(uid).add(socket.id);
    socket.join(uid);

    // First connection → mark online
    if (onlineUsers.get(uid).size === 1) {
      await User.findByIdAndUpdate(uid, {
        isOnline: true,
        lastActive: new Date(),
      });

      io.emit("updateUserStatus", {
        userId: uid,
        isOnline: true,
        lastActive: new Date(),
      });
    }

    // Fetch offline messages
    const pendingMessages = await Message.find({
      messageTo: uid,
      status: "SENT",
    }).sort({ createdAt: 1 });

    // Update DB first
    await Message.updateMany(
      { messageTo: uid, status: "SENT" },
      { status: "DELIVERED" }
    );

    // Then emit
    pendingMessages.forEach((msg) => {
      socket.emit("receiveMessage", {
        ...msg.toObject(),
        formattedDate: new Date(msg.createdAt).toLocaleString("en-IN"),
      });

      io.to(String(msg.messageFrom)).emit("messageStatusUpdate", {
        messageId: msg.messageId,
        status: "DELIVERED",
      });
    });

    console.log(`✅ User ${uid} joined with socket ${socket.id}`);
  });

  socket.on("userOffline", async (userId) => {
    if (!userId) return;

    onlineUsers.delete(userId);

    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastActive: new Date(),
    });
    io.emit("updateUserStatus", {
      userId,
      isOnline: false,
      lastActive: new Date(),
    });
  });
  socket.on("messageSeen", async ({ from, to }) => {
    const seenMessages = await Message.find({
      messageFrom: from,
      messageTo: to,
      status: "DELIVERED",
    });

    await Message.updateMany(
      { messageFrom: from, messageTo: to, status: "DELIVERED" },
      { status: "SEEN" }
    );

    seenMessages.forEach((msg) => {
      io.to(from).emit("messageStatusUpdate", {
        messageId: msg.messageId,
        status: "SEEN",
      });
    });
  });
  socket.on("chatSeen", async ({ from, to }) => {
    const messages = await Message.find({
      messageFrom: from,
      messageTo: to,
      status: "DELIVERED",
    });

    await Message.updateMany(
      { messageFrom: from, messageTo: to, status: "DELIVERED" },
      { status: "SEEN" }
    );
    await Notification.updateMany(
      { messageFrom: from, messageTo: to, read: false },
      { read: true }
    );

    messages.forEach((msg) => {
      io.to(from).emit("messageStatusUpdate", {
        messageId: msg.messageId,
        status: "SEEN",
      });
    });
  });
  socket.on("chatOpen", async ({ userId, to }) => {
    chatUsers.set(userId, to);
  });

  socket.on("chatClose", async (userId) => {
    chatUsers.delete(userId);
  });
  socket.on("sendingMessage", async (data) => {
    console.log("anilog ~ data:", data);
    try {
      const { messageFrom, messageTo, content } = data;
      if (!messageFrom || !messageTo || !content) return;

      const messageId = generateSnowflakeId();
      const receiverOnline =
        onlineUsers.has(messageTo) && onlineUsers.get(messageTo).size > 0;

      const sameChat =
        receiverOnline &&
        chatUsers.has(messageTo) &&
        chatUsers.get(messageTo) === messageFrom;
      const status = receiverOnline ? "DELIVERED" : "SENT";

      const newMsg = await Message.create({
        messageId,
        messageFrom: String(messageFrom),
        messageTo: String(messageTo),
        content,
        status,
      });

      const formattedMsg = {
        ...newMsg.toObject(),
        formattedDate: new Date(newMsg.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };

      // Send to sender (echo)
      console.log("anilog ~ formattedMsg:", formattedMsg);
      io.to(String(messageFrom)).emit("receiveMessage", formattedMsg);

      // Send to receiver ONLY if online
      if (receiverOnline) {
        io.to(String(messageTo)).emit("receiveMessage", formattedMsg);
      }

      // Load sender info from cache / DB
      if (!userCache.has(messageFrom)) {
        const user = await User.findById(messageFrom).select("name");
        userCache.set(messageFrom, user.name);
      }

      if (!userProfile.has(messageFrom)) {
        const profile = await UserProfile.findOne({
          userId: messageFrom,
        }).select("avatar");
        userProfile.set(messageFrom, profile.avatar);
      }

      const senderName = userCache.get(messageFrom);
      const avatar = userProfile.get(messageFrom);

      // Create notification only if not same chat
      if (!sameChat) {
        const notification = await Notification.create({
          messageId,
          senderName,
          messageFrom,
          messageTo,
          content,
          read: false,
          avatar,
        });

        // Emit notification only if receiver online
        if (receiverOnline) {
          io.to(messageTo).emit("notification", {
            _id: notification._id,
            messageId,
            senderName,
            messageFrom,
            messageTo,
            content,
            avatar,
            createdAt: notification.createdAt,
          });
        }
      }

      // Update status ONLY if receiver online
      if (receiverOnline) {
        io.to(String(messageFrom)).emit("messageStatusUpdate", {
          messageId,
          status: "DELIVERED",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("notificationRead", async ({ from, to }) => {
    await Notification.findByIdAndUpdate(
      { messageFrom: from, messageTo: to, read: false },
      { read: true }
    );
  });

  // video call

  socket.on("callUser", ({ from, to, callType }) => {
    io.to(to).emit("incomingCall", { from, callType });
  });
  socket.on("webrtcOffer", ({ to, offer }) => {
    io.to(to).emit("webrtcOffer", offer);
  });
  socket.on("acceptCall", ({ from, to }) => {
    io.to(to).emit("callAccepted", { from });
  });
  socket.on("rejectCall", ({ from, to }) => {
    io.to(to).emit("callRejected", { from });
  });
  socket.on("webrtcAnswer", ({ to, answer }) => {
    io.to(to).emit("webrtcAnswer", answer);
  });

  socket.on("webrtcIceCandidate", ({ to, candidate }) => {
    io.to(to).emit("webrtcIceCandidate", candidate);
  });

  socket.on("endCall", ({ to }) => {
    io.to(to).emit("callEnded");
  });

  socket.on("disconnect", async () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        chatUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastActive: new Date(),
        });

        io.emit("updateUserStatus", {
          userId,
          isOnline: false,
          lastActive: new Date(),
        });
      }
    }
  });
});

app.get("/messages/:u1/:u2", async (req, res) => {
  const { u1, u2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { messageFrom: u1, messageTo: u2 },
        { messageFrom: u2, messageTo: u1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
