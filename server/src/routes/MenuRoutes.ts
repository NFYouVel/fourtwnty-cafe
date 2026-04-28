import { Router } from "express";
import { getAllMenuWithIngredients, getMenuById, createMenu, updateMenu, deleteMenu } from "../controllers/menuController.js";

const router: Router = Router();

router.get("/all", getAllMenuWithIngredients);
router.get("/:id", getMenuById);
router.post("/create", createMenu);
router.put("/update/:id", updateMenu);
router.delete("/delete/:id", deleteMenu);

export default router;