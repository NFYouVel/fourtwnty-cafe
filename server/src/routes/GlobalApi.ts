import { Router } from "express";
import AuthenticationRoutes from "./AuthenticationRoutes.js"
import TableInformationRoutes from "./TableInformationRoutes.js"
import StockRoutes from "./StockRoutes.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import ReportRoutes from "./ReportRoutes.js";

const router: Router = Router();

// Public
router.use("/auth", AuthenticationRoutes);

// Private
router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.use("/stock", StockRoutes)
router.use("/report", ReportRoutes)

export default router; 