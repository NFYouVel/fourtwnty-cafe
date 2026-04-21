import { Router } from "express";
import { createReservation, getAllReservation, getUserReservations, requestReschedule, staffUpdateReservationStatus } from "../controllers/reservationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get("/all", getAllReservation);
router.post("/create", authMiddleware, createReservation);
router.put("/:id", staffUpdateReservationStatus);
router.put("/:id", requestReschedule) 
router.get('/myReservation', getUserReservations)

export default router;