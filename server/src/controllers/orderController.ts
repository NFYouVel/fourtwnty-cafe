import { Request, Response } from "express";
import { Menu } from "../../models/Menu.js";
import { v4 as uuidv4 } from 'uuid';
import { Order } from "../../models/Order.js";
import { OrderMenu } from "../../models/OrderMenu.js";
import { TableInformation } from "../../models/TableInformation.js";
import { Payment } from "../../models/Payment.js";
import { Stock } from "../../models/Stock.js";
import { MenuIngredient } from "../../models/MenuIngredient.js";

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
                message:
                    "Nomor meja tidak ditemukan di sistem"
            });
        }

        /* =========================
           CHECK STOCK
        ========================= */
        for (const item of items) {
            const ingredients = await MenuIngredient.findAll({
                where: {
                    menuId: item.menuId
                },
                include: [
                    {
                        model: Stock
                    }
                ]
            }
            );

            for (const row of ingredients) {
                console.log(row.toJSON());
                const need = row.jumlah_pemakaian * item.quantity;
                console.log(need)
                const stock = row.stock;

                const currentAmount = stock.amount;

                if (currentAmount < need) {
                    return res.status(400).json({
                        success: false,
                        message: `Stock ${stock.ingredient_name} tidak cukup`
                    });
                }
            }
        }

        /* =========================
           REDUCE STOCK
        ========================= */
        for (const item of items) {
            const ingredients = await MenuIngredient.findAll({
                        where: {
                            menuId:
                                item.menuId
                        },
                        include: [
                            {
                                model: Stock
                            }
                        ]
                    }
                );

            for (const row of ingredients) {
                const need = row.jumlah_pemakaian * item.quantity;

                const stock = row.stock;
                
                const currentAmount = stock.getDataValue("amount");

                await stock.update({
                    amount: currentAmount - need
                });
            }
        }

        const total = items.reduce(
            (
                acc: number,
                item: any
            ) =>
                acc + item.price * item.quantity,
            0
        );

        const payload = {
            id: uuidv4(),
            order_type: "Dine-in",
            status: "Process",
            total_price: total,
            userId: items[0].userId,
            tableId:tableRecord.id,

            payment: {
                id: uuidv4(),
                status:
                    "Unpaid"
            },

            orderMenus:
                items.map(
                    (
                        item: any
                    ) => ({
                        id: uuidv4(),
                        menuId:
                            item.menuId,
                        quantity:
                            item.quantity,
                        customization:
                            item.customization ||
                            ""
                    })
                )
        };

        const result =
            await Order.create(
                payload,
                {
                    include: [
                        {
                            model:
                                OrderMenu
                        },
                        {
                            model:
                                Payment
                        }
                    ]
                }
            );

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            message:
                error.message
        });
    }
};


export const getAllProcessOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findAll({
            attributes: [
                "id",
                "order_type",
                "status",
                "total_price",
                "createdAt"
            ],

            include: [
                {
                    model: OrderMenu,
                    attributes: [
                        "id",
                        "customization",
                        "menuId"
                    ],
                    include: [
                        { model: Menu, attributes: ["id", "name", "price"] }
                    ]
                },
                {
                    model: Payment,
                    where: {
                        status: "Unpaid"
                    },
                    attributes: [
                        "id",
                        "status",
                        "method"
                    ]
                },
                {
                    model: TableInformation,
                    attributes: [
                        "id",
                        "table_number",
                        "area"
                    ]
                }
            ],

            order: [
                ["createdAt", "DESC"]
            ]
        });

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed get order"
        });
    }
};

export const PayOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { method } = req.body;

        const payment = await Payment.findOne({
            where: {
                orderId: orderId
            },
            include: [
                { model: Order }
            ]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Data pembayaran tidak ditemukan"
            });
        }

        /* UPDATE PAYMENT */
        await payment.update({
            status: "Paid",
            method: method
        });

        /* UPDATE ORDER */
        await Order.update(
            {
                status: "Closed"
            },
            {
                where: {
                    id: orderId
                }
            }
        );

        res.json({
            success: true,
            message: "Pembayaran berhasil diperbarui",
            data: payment
        });

    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal memperbarui pembayaran",
            error: error.message
        });
    }
};

export const getTableDineInAvailability = async (req: Request, res: Response) => {
    try {
        const response = await Order.findAll({
            where: {
                status: "Process",
                order_type: "Dine-in"
            },

            include: [
                {
                    model: TableInformation,
                    attributes: [
                        "id",
                        "table_number",
                        "area"
                    ]
                }
            ],
        });

        res.json(response);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed get table availability"
        });
    }
};
