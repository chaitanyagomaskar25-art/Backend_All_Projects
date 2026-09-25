import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshTokenModel.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: decoded.userId,
      revoked: false,
    });

    if (!storedToken) {
      return res.status(401).json({
        message: "Refresh token is revoked or invalid",
      });
    }

    storedToken.revoked = true;
    
    await storedToken.save();

    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store new refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      user: decoded.userId,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    // Store NEW refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};