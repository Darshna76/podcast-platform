import { User } from "../../index.js";

export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
    await user.save();

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
