import { Router } from "express";
import { createOrder, getAllMenu, getAllProcessOrder, PayOrder, getTableDineInAvailability } from "../controllers/orderController.js";

const router: Router = Router();

router.get("/menu", getAllMenu)
router.post("/create", createOrder)
router.get("/process", getAllProcessOrder)
router.put("/pay/:orderId", PayOrder)
router.get("/table-availability", getTableDineInAvailability)

export default router;