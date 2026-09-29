import { ResetPassword } from "../models/PassowrdReset.js";
import { User } from "../models/userModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({
        message: "Email required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await ResetPassword.deleteMany({ user: user._id });

    await ResetPassword.create({
      user: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 1000 * 60),
    });

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>

        <p>Hello ${user.name},</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetURL}">
          Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>

        <p>If you did not request a password reset, ignore this email.</p>
      `,
    });

    return res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) {
      return res.status(401).json({
        message: "Email & token required.",
      });
    }

    // Hash the token received from the user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find reset token
    const resetRecord = await ResetPassword.findOne({
      token: hashedToken,
    });

    if (!resetRecord) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    if (resetRecord.expiresAt < Date.now()) {
      await ResetPassword.deleteOne({ token: hashedToken });

      return res.status(401).json({
        message: "Time limit exceed.",
      });
    }

    const user = await User.findOne({ user: resetPassword.user });

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

        // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Save new password
    user.password = hashedPassword;

    await user.save();

    // Invalidate reset token
    await PasswordReset.deleteOne({
      user : resetRecord._id,
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });


  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
