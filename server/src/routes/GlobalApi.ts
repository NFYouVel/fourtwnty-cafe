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
import {
    changePassword,
    updateProfile,
    getProfile
} from "../controllers/profileController.js";

// Profile routes

const router: Router = Router();

// Public
router.use("/auth", AuthenticationRoutes);

// Private
//router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.get("/profile/:id", getProfile);
router.put("/profile/update", updateProfile);
router.put("/profile/change-password", changePassword);
router.use("/order", OrderRoutes)
router.use("/tableInformation", TableInformationRoutes)
router.use("/stock", StockRoutes)
router.use("/staff", CreateStaffRoutes)
router.use("/reservation", ReservationRoutes)
router.use("/report", ReportRoutes)
router.use("/menu", MenuRoutes)

export default router; 