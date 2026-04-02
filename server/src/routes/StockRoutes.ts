import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController.js";
import { getAllStock } from "../controllers/stockController.js";
import { getAllTable } from "../controllers/tableInformationController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();
 
router.get("/all", getAllStock);

export default router;
