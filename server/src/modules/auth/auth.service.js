import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { User, RefreshToken, PasswordResetToken } from "../index.js";

const createToken = (user, secret, expiresIn) =>
  jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async ({ email, otp }) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(`[OTP DEBUG] Password reset OTP for ${email}: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,
    to: email,
    subject: "Podcast Platform - Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #20062e; color: #ffffff; border-radius: 16px;">
        <h2 style="margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #d7d7d7;">Use the OTP below to reset your password:</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; padding: 20px 0; color: #18b2de;">${otp}</div>
        <p style="color: #d7d7d7;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

export const authService = {
  async register({ name, email, password, avatarUrl }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      avatarUrl,
    });

    return user;
  },

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user)
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });

    const accessToken = createToken(
      user,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    );
    const refreshToken = createToken(
      user,
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    );

    await RefreshToken.create({
      id: uuidv4(),
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(token) {
    const refreshRecord = await RefreshToken.findOne({
      where: { token, revoked: false },
    });
    if (!refreshRecord)
      throw Object.assign(new Error("Invalid refresh token"), {
        statusCode: 401,
      });

    if (new Date(refreshRecord.expiresAt) < new Date()) {
      throw Object.assign(new Error("Refresh token expired"), {
        statusCode: 401,
      });
    }

    const user = await User.findByPk(refreshRecord.userId);
    const accessToken = createToken(
      user,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    );
    return { accessToken };
  },

  async logout(token) {
    await RefreshToken.update({ revoked: true }, { where: { token } });
    return { success: true };
  },

  async updateUser({ id, name, email, bio, avatarUrl }) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.bio = bio ?? user.bio;

    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    await user.save();

    const safeUser = user.toJSON();
    delete safeUser.password;

    return safeUser;
  },

  async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Object.assign(new Error("No account found for this email"), {
        statusCode: 404,
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const otpHash = await bcrypt.hash(otp, 10);

    await PasswordResetToken.destroy({ where: { userId: user.id } });
    await PasswordResetToken.create({
      id: uuidv4(),
      otpHash,
      expiresAt,
      userId: user.id,
    });

    await sendOtpEmail({ email: user.email, otp });

    return {
      message: "OTP sent successfully. Please check your email.",
      email: user.email,
    };
  },

  async verifyPasswordResetOtp({ email, otp }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Object.assign(new Error("No account found for this email"), {
        statusCode: 404,
      });
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!resetToken) {
      throw Object.assign(new Error("No OTP request found"), {
        statusCode: 400,
      });
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      throw Object.assign(
        new Error("OTP has expired. Please request a new one."),
        {
          statusCode: 400,
        },
      );
    }

    const isValidOtp = await bcrypt.compare(otp, resetToken.otpHash);
    if (!isValidOtp) {
      throw Object.assign(new Error("Invalid OTP"), {
        statusCode: 400,
      });
    }

    resetToken.usedAt = new Date();
    await resetToken.save();

    return {
      message: "OTP verified successfully.",
      email: user.email,
    };
  },

  async resetPassword({ email, otp, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Object.assign(new Error("No account found for this email"), {
        statusCode: 404,
      });
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!resetToken) {
      throw Object.assign(new Error("No OTP request found"), {
        statusCode: 400,
      });
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      throw Object.assign(
        new Error("OTP has expired. Please request a new one."),
        {
          statusCode: 400,
        },
      );
    }

    const isValidOtp = await bcrypt.compare(otp, resetToken.otpHash);
    if (!isValidOtp) {
      throw Object.assign(new Error("Invalid OTP"), {
        statusCode: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await PasswordResetToken.destroy({ where: { userId: user.id } });

    return { message: "Password reset successfully." };
  },
};
