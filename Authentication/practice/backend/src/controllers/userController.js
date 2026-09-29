import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshTokenModel.js";
import { EmailVerification } from "../models/EmailVerification.js";
import { generateVerificationToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { LoginOtp } from "../models/loginOTP.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "User information is incomplete.",
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(401).json({
        message: "User with this email already exist.",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // 1. Generate verification token
    const token = generateVerificationToken();

    // 2. Save verification token
    await EmailVerification.create({
      userId: user._id,
      token: token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // 3. Create verification link
    const verificationLink = `http://localhost:3000/users/verify-email?token=${token}`;

    // 4. Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
    <h2>Welcome ${user.name}</h2>

    <p>Thanks for registering.</p>

    <p>Please click the button below to verify your email.</p>

    <a href="${verificationLink}">
      Verify Email
    </a>

    <p>This link expires in 15 minutes.</p>
  `,
    });

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "User information is incomplete",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User email or password is incorrect.",
      });
    }

    const hashPassword = await bcrypt.compare(password, user.password);

    if (!hashPassword) {
      return res.status(401).json({
        message: "User email or password is wrong.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // Check whether an OTP already exists

    const existingOtp = await LoginOtp.findOne({ user: user._id });

    if (existingOtp) {
      const cooldown = 60 * 1000;
      const timePassed = Date.now() - existingOtp.createdAt.getTime();

      if (timePassed < cooldown) {
        const remainingSeconds = Math.ceil((cooldown - timePassed) / 1000);

        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        });
      }
    }


    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove previous OTP
    await LoginOtp.deleteMany({
      user: user._id,
    });

    await LoginOtp.create({
      user: user._id,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: "Your Login OTP",
      html: `
        <h2>Login Verification</h2>

        <p>Hello ${user.name},</p>

        <p>Your login OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "User authenticated.",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({
        message: "Refresh token is missing.",
      });
    }

    const isRefreshToken = await RefreshToken.findOne({
      token: refresh_token,
    });

    if (!isRefreshToken) {
      return res.status(401).json({
        message: "Refresh token is invalid.",
      });
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const access_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" },
    );

    const new_refresh_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    await RefreshToken.deleteOne({ token: refresh_token });

    await RefreshToken.create({
      token: new_refresh_token,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Access token refreshed successfully.",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token.",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (refresh_token) {
      await RefreshToken.deleteOne({
        token: refresh_token,
      });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
  console.log("Authorization check:");
  console.log("Email:", req.user.email);
  console.log("Role:", req.user.role);

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not allowed to access this route.",
    });
  }

  next();
};
