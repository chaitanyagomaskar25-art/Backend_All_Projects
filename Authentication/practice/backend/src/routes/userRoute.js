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
import {  verifyEmail, verifyLoginOtp } from "../controllers/emailVerificationController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";

export const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/verify-login-otp", verifyLoginOtp)

router.get("/profiles", authMiddleware, adminOnly, getProfiles);

// router.get("/users/test-email", testEmail)

router.get("/users/verify-email", verifyEmail)

