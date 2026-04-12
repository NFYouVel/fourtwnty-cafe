import { Router } from "express";
import { getMenuCategory } from "../controllers/orderController.js";

const router: Router = Router();

router.get("/category", getMenuCategory)

export default router;