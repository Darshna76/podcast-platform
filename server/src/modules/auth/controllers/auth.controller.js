import { authService } from "../auth.service.js";
import { slugify } from "../../../shared/utils.js";

export const register = async (req, res, next) => {
  try {
    const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    const user = await authService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatarUrl,
    });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const payload = await authService.login(req.body);
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const payload = await authService.refreshToken(req.body.refreshToken);
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const payload = await authService.logout(req.body.refreshToken);
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const avatarUrl = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : undefined;

    const user = await authService.updateUser({
      id: req.user.id, // or req.user.sub if your JWT stores the id in `sub`
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      avatarUrl,
    });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};