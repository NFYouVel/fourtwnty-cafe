import { Router } from "express";
import { createReservation, getAllReservation, requestReschedule, staffUpdateReservationStatus } from "../controllers/reservationController.js";

const router: Router = Router();

router.get("/all", getAllReservation);
router.post("/create", createReservation);
router.put("/updateStatus", staffUpdateReservationStatus);
router.put("/reschedule", requestReschedule) 

export default router;