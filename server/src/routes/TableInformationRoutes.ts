import { Router } from "express";
import { getAllTable } from "../controllers/tableInformationController.js";

const router: Router = Router();

router.get("/tableInformation", getAllTable); 

export default router;