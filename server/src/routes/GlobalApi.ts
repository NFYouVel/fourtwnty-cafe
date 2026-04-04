import { Router } from "express";
import AuthenticationRoutes from "./AuthenticationRoutes.js"
import TableInformationRoutes from "./TableInformationRoutes.js"
import StockRoutes from "./StockRoutes.js"
import CreateStaffRoutes from './CreateStaffRoutes.js'
import ReservationRoutes from './ReservationRoutes.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

// Public
router.use("/auth", AuthenticationRoutes);

// Private
//router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.use("/tableInformation", TableInformationRoutes)
router.use("/stock", authMiddleware, StockRoutes)
router.use("/staff", CreateStaffRoutes)
router.use("reservation", ReservationRoutes)

export default router; 