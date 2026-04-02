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

export const getTableById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const table = await TableInformation.findByPk(id as string);

        if (!table) {
            return res.status(404).json({
                status: "Fail",
                message: "Table dengan ID tersebut tidak ditemukan"
            })
        }

        return res.status(200).json({
            status: "Success",
            data: table
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get Table by ID error" })
    }
}