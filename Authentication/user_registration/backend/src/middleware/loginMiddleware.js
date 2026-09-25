import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
export const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "User Information is incorrect.",
        status: "failed",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User did not found with given email",
        status: "failed",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password is incorrect.",
        status: "failed",
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};
