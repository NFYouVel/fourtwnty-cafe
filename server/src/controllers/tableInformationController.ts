import { TableInformation } from "../../models/TableInformation.js"
import { Request, Response } from "express";

export const getAllTable = async (req: Request, res: Response) => {
    try {
        const table = await TableInformation.findAll();
        res.json(table);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get All Table error" });
    }
}