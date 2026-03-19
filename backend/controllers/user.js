const { User } = require("../models/User");
const { UserProfile } = require("../models/UserProfile");

const allUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "name email createdAt");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

const userById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await User.find({ _id: id }, "name email createdAt");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: "Avatar is required" });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { avatar },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Profile updated", avatar: profile.avatar });
  } catch (error) {
    return next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    return res.status(200).json({ avatar: profile.avatar || null });
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const deletedProfile = await UserProfile.findOneAndDelete({
      userId: req.user.id,
    });

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ message: "Porfile deleted" });
  } catch (error) {
    next(error);
  }
};

const profileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const getProfile = await UserProfile.findOne({ userId: id });
    return res.status(200).json(getProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allUsers,
  userProfile,
  profile,
  deleteProfile,
  profileById,
  userById,
};
