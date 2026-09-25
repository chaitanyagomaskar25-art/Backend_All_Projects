import { RefreshToken } from "../models/refreshTokenModel.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
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

export const login = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User matched with given email",
      status: "success",
      accessToken,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "Token is valid",
      status: "success",
      user: user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      status: "failed",
    });
  }
};


export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
      await RefreshToken.findOneAndUpdate({token: refreshToken}, {revoked: true})
    }

    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
}