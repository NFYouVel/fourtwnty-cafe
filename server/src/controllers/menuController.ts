import { Request, Response } from "express";
import { Menu } from "../../models/Menu.js";
import { MenuIngredient } from "../../models/MenuIngredient.js";
import { Stock } from "../../models/Stock.js";

export const getAllMenuWithIngredients = async (req: Request, res: Response) => {
    try {
        const menus = await Menu.findAll({
            include: [{
                model: MenuIngredient,
                include: [{
                    model: Stock,
                    attributes: ["id", "ingredient_name", "unit"]
                }]
            }],
            order: [["createdAt", "DESC"]]
        });

        res.json(menus);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed get menus"
        });
    }
};

export const getMenuById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const menu = await Menu.findByPk(id, {
            include: [{
                model: MenuIngredient,
                include: [{
                    model: Stock,
                    attributes: ["id", "ingredient_name", "unit"]
                }]
            }]
        });

        if (!menu) {
            return res.status(404).json({
                message: "Menu not found"
            });
        }

        res.json(menu);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed get menu"
        });
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        const {
            name,
            price,
            category,
            drink_category,
            description,
            ingredients
        } = req.body;

        const menu = await Menu.create({
            name,
            price,
            category,
            drink_category: category === "Drink" ? drink_category : null,
            description
        });

        // ingredients = [{ stockId: "xxx", jumlah_pemakaian: 100 }, ...]
        if (ingredients && ingredients.length > 0) {
            const ingredientData = ingredients.map(
                (ing: any) => ({
                    menuId: menu.id,
                    stockId: ing.stockId,
                    jumlah_pemakaian: ing.jumlah_pemakaian
                })
            );

            await MenuIngredient.bulkCreate(ingredientData);
        }

        res.status(201).json({
            success: true,
            message: "Menu created successfully",
            data: menu
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create menu",
            error: error.message
        });
    }
};

export const updateMenu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const {
            name,
            price,
            category,
            drink_category,
            description,
            ingredients
        } = req.body;

        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found"
            });
        }

        /* UPDATE MENU */
        await menu.update({
            name,
            price,
            category,
            drink_category: category === "Drink" ? drink_category : null,
            description
        });

        /* DELETE OLD INGREDIENTS */
        await MenuIngredient.destroy({
            where: { menuId: id }
        });

        /* INSERT NEW INGREDIENTS */
        if (ingredients && ingredients.length > 0) {
            const ingredientData = ingredients.map(
                (ing: any) => ({
                    menuId: id,
                    stockId: ing.stockId,
                    jumlah_pemakaian: ing.jumlah_pemakaian
                })
            );

            await MenuIngredient.bulkCreate(ingredientData);
        }

        res.json({
            success: true,
            message: "Menu updated successfully",
            data: menu
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update menu",
            error: error.message
        });
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found"
            });
        }

        /* DELETE INGREDIENTS FIRST */
        await MenuIngredient.destroy({
            where: { menuId: id }
        });

        /* DELETE MENU */
        await menu.destroy();

        res.json({
            success: true,
            message: "Menu deleted successfully"
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete menu",
            error: error.message
        });
    }
};