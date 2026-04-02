import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController.js";

const router: Router = Router();

router.post("/auth/register", createUser);
router.post("/auth/login", loginUser);
router.get("/user", getUsers);

export default router; 