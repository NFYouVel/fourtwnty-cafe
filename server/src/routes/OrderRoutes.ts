import { Router } from "express";
import { createOrder, getAllMenu } from "../controllers/orderController.js";

const router: Router = Router();

router.get("/menu", getAllMenu)
router.post("/create", createOrder)

export default router;