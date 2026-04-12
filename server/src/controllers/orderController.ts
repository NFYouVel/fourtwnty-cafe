import { Request, Response } from "express";
import { Menu } from "../../models/Menu.js";

import { sequelize } from "../config/database.js";

export const getMenuCategory = async (req: Request, res: Response) => {
    try {
        const [cat]: any = await sequelize.query(
            "SHOW COLUMNS FROM Menu LIKE 'category'"
        );

        const [drink]: any = await sequelize.query(
            "SHOW COLUMNS FROM Menu LIKE 'drink_category'"
        );

        const categorized = cat[0].Type
            .replace("enum(", "")
            .replace(")", "")
            .replaceAll("'", "")
            .split(",");

        const drinkCategorized = drink[0].Type
            .replace("enum(", "")
            .replace(")", "")
            .replaceAll("'", "")
            .split(",");

        res.json({
            categorized,
            drinkCategorized
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed get enum"
        });
    }
};
