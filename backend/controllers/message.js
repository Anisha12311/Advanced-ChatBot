const { Message } = require("../models/Message");
const { Notification } = require("../models/Notification");
const { UserProfile } = require("../models/UserProfile");

const getNotificaiton = async (req, res, next) => {
  const { messageTo } = req.params;
  try {
    const notifications = await Notification.find({
      messageTo,
      read: false,
    }).sort({ createdAt: -1 });

    console.log("anilog ~ notifications:", notifications);

    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const result = await Notification.deleteOne({ _id });
    if (!result.deletedCount) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

const markAsReadNotification = async (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user.id;
  try {
    const notificaiton = await Notification.findOne({ _id, messageTo: userId });

    if (!notificaiton) {
      return res.status(400).status({ message: "Notification is not found" });
    }

    notificaiton.read = true;
    await notificaiton.save();

    await Message.updateMany(
      {
        messageFrom: notificaiton.messageFrom,
        messageTo: userId,
        status: "DELIVERED",
      },
      { status: "SEEN" }
    );

    return res.status(200).json({
      message: "Notification marked as read",
      notificationId: _id,
    });
  } catch (error) {}
};

module.exports = {
  getNotificaiton,
  deleteNotification,
  markAsReadNotification,
};
