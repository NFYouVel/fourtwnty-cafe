import { Request, Response } from "express";
import { Menu } from "../../models/Menu.js";

export const getAllMenu = async (req: Request, res: Response) => {
    try {
        const menu = await Menu.findAll({
            order: [["createdAt", "DESC"]]
        });

        res.json(menu);

    } catch (error) {
        res.status(500).json({
            message: "Failed get menu"
        });
    }
};
