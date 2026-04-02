import { Router } from "express";
import { getAllStock } from "../controllers/stockController.js";

const router: Router = Router();
 
router.get("/all", getAllStock);

export default router;
