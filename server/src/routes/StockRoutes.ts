import { Router } from "express";
import { getAllStock } from "../controllers/stockController.js";
import { createStock } from "../controllers/stockController.js";
import { updateStock } from "../controllers/stockController.js";
import { deleteStock } from "../controllers/stockController.js";

const router: Router = Router();
 
router.get("/all", getAllStock);
router.post("/create" , createStock);
router.put("/update/:id", updateStock);
router.delete("/delete/:id", deleteStock);

export default router;
