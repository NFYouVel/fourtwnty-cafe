import { Router } from "express";
import { createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../controllers/createStaffController.js";

const router: Router = Router();

router.get('/all', getAllStaff)
router.get('/:id', getStaffById)
router.post('/create', createStaff)
router.put('/:id', updateStaff)
router.delete('/:id', deleteStaff)

export default router;