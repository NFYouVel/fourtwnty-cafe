import { Router } from "express";
import { addTable, deleteTable, getAllTable, getTableAvailability, getTableById, updateTable } from "../controllers/tableInformationController.js";

const router: Router = Router();

router.get('/availability', getTableAvailability);
router.get("/all", getAllTable); 
router.get("/:id", getTableById);
router.post("/create", addTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;