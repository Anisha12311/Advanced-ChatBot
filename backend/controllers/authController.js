const JWT = require("jsonwebtoken");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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

const forgetPassword = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exisitingUsr = await User.findOne({ email });

    if (!exisitingUsr) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const token = generateToken(exisitingUsr._id);
    const resetURL = `http://localhost:3000/resetpassword?id=${exisitingUsr._id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "mark.ledner@ethereal.email",
        pass: "f5TtEMWnNBE3M2VUcw",
      },
    });

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
      </div>
       
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Hi <strong>${exisitingUsr.name}</strong>,
        </p>
         
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
         
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
         
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          This link will expire in <strong>15 minutes</strong> for security reasons.
        </p>
         
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
         
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999; margin: 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetURL}" style="color: #667eea; word-break: break-all;">${resetURL}</a>
          </p>
        </div>
      </div>
    </div>
  `;

    const textContent = `
    Hi ${exisitingUsr},
     
    Your password has been changed successfully. You can now log in with your new password.
     
    If you didn't make this change, please contact our support team immediately.
  `;

    const mailOptions = {
      to: exisitingUsr.email,
      from: process.env.EMAIL,
      subject: "Password Reset Request",
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Password resent link sent to your mail" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { id, token } = req.query;

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(400).json({ message: "Token expired" });
      }
    });
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashPassword,
        },
      }
    );

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  forgetPassword,
  resetPassword,
};
