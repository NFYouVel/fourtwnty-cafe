import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/", authMiddleware, getUsers);
router.post("/auth/register", createUser);
router.post("/auth/login", loginUser);

export default router;