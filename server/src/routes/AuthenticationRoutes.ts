import { Router } from "express";
import { createUser, loginUser, getUserByEmail, forgotPassword, verifyResetCode, resetPassword } from "../controllers/userController.js";

const router: Router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/user", getUserByEmail);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router; 