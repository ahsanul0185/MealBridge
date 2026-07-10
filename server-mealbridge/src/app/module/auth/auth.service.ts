import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../models/User.js";
import { generateToken } from "../../utils/jwt.js";
import AppError from "../../errorHelpers/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";
import config from "../../config/env.js";
import {
  IRegisterPayload,
  ILoginPayload,
  IForgotPasswordPayload,
  IResetPasswordPayload,
} from "./auth.interface.js";

const register = async (payload: IRegisterPayload) => {
  const { email, password, ...rest } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
  const { email } = payload;

  const user = await User.findOne({ email });

  if (user) {
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${config.client_url}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset your MealBridge password</h2>
        <p>You requested a password reset. Click the button below to set a new password. This link expires in 10 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "MealBridge Password Reset",
      html,
    });
  }

  // Always return a generic message to prevent email enumeration.
  return {
    message: "If an account with that email exists, a reset link has been sent.",
  };
};

const resetPassword = async (token: string, payload: IResetPasswordPayload) => {
  const { password } = payload;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(400, "Token is invalid or has expired");
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return {
    message: "Password reset successfully. Please log in with your new password.",
  };
};

const authService = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

export default authService;
