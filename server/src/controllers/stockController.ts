import { Stock } from "../../models/Stock.js";
import { Request, Response } from "express";

export const getAllStock = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll(); // Find All itu bawaan dari express buat ngambil semua datanya
        res.json(stock); // Ini buat return semua users dalam bentuk objek 
    } catch (error) {
        res.status(500).json({ message: "Error fetching all users." });
    }
}