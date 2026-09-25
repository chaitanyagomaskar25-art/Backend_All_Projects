import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token is missing",
        status: "failed",
      });
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Token is not in valid format",
        status: "failed",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User is not found",
        status: "failed",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired token",
      status: "failed",
    });
  }
};