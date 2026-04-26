import { Router } from "express";
import { getReport } from "../controllers/reportController.js";

const router: Router = Router();

// Get Report
router.get("/", getReport);

export default router;
 
