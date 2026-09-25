import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../model/refreshToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "User Information is incomplete.",
        status: "failed",
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(409).json({
        message: "User with this email already exist.",
        status: "failed",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully..!!",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "User Information is incomplete.",
        status: "failed",
      });
    }

    const exist = await User.findOne({ email }).select("+password");

    if (!exist) {
      return res.status(404).json({
        message: "User not found.",
        status: "failed",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, exist.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "User email or password incorrect.",
        status: "failed",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: exist._id,
        email: exist.email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: exist._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await RefreshToken.create({
      token: refreshToken,
      user: exist._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User registered successfully..!!",
      status: "success",
      user: exist,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(400).json({
        status: "failed",
        message: "Access token is not defined",
      });
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(400).json({
        status: "failed",
        message: "Access token is not valid",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const exist = await User.findById(decoded.userId);

    if (!exist) {
      return res.status(401).json({
        message: "User is not found",
        status: "failed",
        user: exist,
      });
    }

    res.status(200).json({
      message: "Token is valid",
      status: "success",
      user: exist,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {    
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        status: "Failed",
        message: "Refresh token is not found",
      });
    }

    await RefreshToken.findAndUpdate(
      { token: refreshToken },
      { revoked: true },
    );
    res.status(200).json({
      status: "Success",
      message: "User logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
