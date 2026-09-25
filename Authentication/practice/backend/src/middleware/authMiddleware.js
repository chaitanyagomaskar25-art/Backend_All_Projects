import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
   console.log("🔥 AUTH MIDDLEWARE CALLED");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  
    try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User does not exist.",
      });
    }

    console.log("Logged-in user:", user.email);
    console.log("Logged-in user role:", user.role);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token.",
    });
  }
};