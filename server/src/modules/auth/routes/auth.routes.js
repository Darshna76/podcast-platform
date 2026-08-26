import express from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
  updateUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../../../shared/middleware.js";
import { validateLogin, validateRegister } from "../../../shared/validate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  validateRegister,
  register
);router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.put("/me", authenticate, upload.single("avatar"), updateUser);

export default router;
