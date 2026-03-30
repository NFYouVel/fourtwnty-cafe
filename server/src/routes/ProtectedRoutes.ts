import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController.js";
import { getAllStock } from "../controllers/stockController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/", getUsers);
router.get("/stock", getAllStock) // http://localhost:5000/api/stock
router.post("/auth/register", createUser);
router.post("/auth/login", loginUser);

export default router; // http://localhost:5000/api/