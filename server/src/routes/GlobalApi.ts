import { Router } from "express";
import AuthenticationRoutes from "./AuthenticationRoutes.js"
import TableInformationRoutes from "./TableInformationRoutes.js"
import StockRoutes from "./StockRoutes.js"
import CreateStaffRoutes from './CreateStaffRoutes.js'
import ReservationRoutes from './ReservationRoutes.js'
import OrderRoutes from './OrderRoutes.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";
import MenuRoutes from "./MenuRoutes.js";
import ReportRoutes from "./ReportRoutes.js";

const router: Router = Router();

// Public
router.use("/auth", AuthenticationRoutes);

// Private
//router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.use("/order", authMiddleware, OrderRoutes)
router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.use("/stock", authMiddleware, StockRoutes)
router.use("/staff", authMiddleware, CreateStaffRoutes)
router.use("/reservation", authMiddleware, ReservationRoutes)
router.use("/report", authMiddleware, ReportRoutes)
router.use("/menu", authMiddleware, MenuRoutes)

export default router; 