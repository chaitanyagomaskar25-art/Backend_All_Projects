import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshTokenModel.js";

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
    res.status(201).json({
      message: "User registered successfully..",
      data: user,
    });
  } catch (error) {
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

    const access_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      },
    );
    const refresh_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "7d",
      },
    );
    await RefreshToken.create({
      userId: user._id,
      token: refresh_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User loggedIn successfully..!!",
      access_token,
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
