import express from "express";
import { getMe, updateProfile } from "../controllers/user.controller.js";
import { authenticate } from "../../../shared/middleware.js";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);

export default router;
