import { Router } from "express";
import { getUsers, createUser, loginUser } from "../controllers/userController.js";
import AuthenticationRoutes from "./AuthenticationRoutes.js"
import TableInformationRoutes from "./TableInformationRoutes.js"
import StockRoutes from "./StockRoutes.js"
import express from 'express';
import { getAllStock } from "../controllers/stockController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

// Public
router.use("/auth", AuthenticationRoutes);

// Private
router.use("/tableInformation", authMiddleware, TableInformationRoutes)
router.use("/stock", authMiddleware,StockRoutes)

export default router; 
