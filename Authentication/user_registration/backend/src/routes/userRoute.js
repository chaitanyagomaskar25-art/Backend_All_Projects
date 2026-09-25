import express from "express";

import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/userController.js";

import { loginMiddleware } from "../middleware/loginMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { refreshAccessToken } from "../controllers/authController.js";

export const router = express.Router();

router.post("/register", register);

router.post("/login", loginMiddleware, login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logout);

router.get("/profile", authMiddleware, getProfile); 