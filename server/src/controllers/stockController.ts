import { Stock } from "../../models/Stock.js";
import { Request, Response } from "express";

//Read Stock
export const getAllStock = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll(); // Find All itu bawaan dari sequelize (ORM) buat ngambil semua datanya
        res.json(stock); // Ini buat return semua stock dalam bentuk objek 
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock." });
    }
}

// Create Stock
export const createStock = async (req: Request, res: Response) => {
    const {ingredient_name, amount, unit} = req.body;
    try {
        const newStock = await Stock.create({ ingredient_name, amount, unit });
        res.json(newStock);
    } catch (error) {
        res.status(500).json({ message: "Error creating stock." });
    }
}

//Update Stock
export const updateStock = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {ingredient_name, amount, unit} = req.body;
    try {
        const updatedStock = await Stock.update({ ingredient_name, amount, unit }, { where: { id } });
        res.json(updatedStock);
    } catch (error) {
        res.status(500).json({ message: "Error updating stock." });
    }
}

//Delete Stock
export const deleteStock = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const deletedStock = await Stock.destroy({ where: { id } });
        res.json(deletedStock);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting stock." });
    }
}


