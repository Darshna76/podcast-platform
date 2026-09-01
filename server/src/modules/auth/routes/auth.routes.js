import express from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resendOtp,
  resetPassword,
  updateUser,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { authenticate } from "../../../shared/middleware.js";
import {
  validateForgotPassword,
  validateLogin,
  validateOtp,
  validateRegister,
  validateResetPassword,
} from "../../../shared/validate.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.put("/me", authenticate, upload.single("avatar"), updateUser);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/resend-otp", validateForgotPassword, resendOtp);
router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
