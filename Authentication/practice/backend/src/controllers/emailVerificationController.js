import { EmailVerification } from "../models/EmailVerification.js";
import { LoginOtp } from "../models/loginOTP.js";
import { RefreshToken } from "../models/refreshTokenModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
        status: "failed",
      });
    }

    const verification = await EmailVerification.findOne({
      token,
    });

    if (!verification) {
      return res.status(400).json({
        message: "Invalid verification token",
        status: "failed",
      });
    }

    if (verification.expriresAt < new Date()) {
      return res.status(400).json({
        message: "Verification token has expired",
        status: "failed",
      });
    }

    const user = await User.findById(verification.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    user.isEmailVerified = true;

    await user.save();

    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    return res.status(200).json({
      message: "Email verified successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      status: "failed",
    });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otpRecord = await LoginOtp.findOne({ user: user._id });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found or already used",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await LoginOtp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    await LoginOtp.deleteOne({
      _id: otpRecord._id,
    });

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

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};
