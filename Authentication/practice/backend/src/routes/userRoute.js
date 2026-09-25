import express from "express";
import {
    adminOnly,
  getProfiles,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/profiles", authMiddleware, adminOnly, getProfiles);
