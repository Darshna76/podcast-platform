import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User, RefreshToken } from "../index.js";
import { slugify } from "../../shared/utils.js";

const createToken = (user, secret, expiresIn) =>
  jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });

export const authService = {
 async register({
  name,
  email,
  password,
  avatarUrl,
}) {
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
  async updateUser({
  id,
  name,
  email,
  bio,
  avatarUrl,
}) {
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
}
};

