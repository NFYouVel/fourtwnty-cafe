import { Request, Response } from "express";
import { Menu } from "../../models/Menu.js";
import { v4 as uuidv4 } from 'uuid';
import { Order } from "../../models/Order.js";
import { OrderMenu } from "../../models/OrderMenu.js";
import { TableInformation } from "../../models/TableInformation.js";

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

export const createOrder = async (req: Request, res: Response) => {
    try {
        const items = req.body;

        const tableRecord = await TableInformation.findOne({
            where: {
                table_number: items[0].tableId
            }
        });

        if (!tableRecord) {
            return res.status(404).json({ 
                success: false, 
                message: "Nomor meja tidak ditemukan di sistem" 
            });
        }

        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        const payload = {
            id: uuidv4(),
            order_type: 'Dine-in',
            status: 'Process',
            total_price: total,
            userId: items[0].userId, 
            tableId: tableRecord.id,

            orderMenus: items.map((item: any) => ({
                id: uuidv4(),
                menuId: item.menuId,
                quantity: item.quantity,
                customization: item.customization || ""
            }))
        };

        const result = await Order.create(payload, {
            include: [OrderMenu]
        });

        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}