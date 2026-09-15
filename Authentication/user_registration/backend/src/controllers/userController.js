import { User } from "../models/userModel.js";

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

    const user = await User.create({
      name,
      email,
      password,
    });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "User Information is incorrect.",
        status: "failed",
      });
    }
    const exist = await User.findOne({ email });

    if (!exist) {
      return res.status(404).json({
        message: "User did not found with given email",
        status: "failed",
      });
    }
    if (exist.password !== password) {
      return res.status(400).json({
        message: "User password is incorrect.",
        status: "failed",
      });
    }
    return res.status(200).json({
      message: "User matched with given email",
      data: exist,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};
