import { Router } from "express";
import { getAllMenu } from "../controllers/orderController.js";

const router: Router = Router();

router.get("/menu", getAllMenu)

export default router;