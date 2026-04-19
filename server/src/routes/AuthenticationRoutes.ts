import { Router } from "express";
import { createUser, loginUser, getUserByEmail } from "../controllers/userController.js";

const router: Router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/user", getUserByEmail);

export default router; 