import { TableInformation } from "../../models/TableInformation.js"
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Op } from "sequelize"; //query '!='
import { Reservation } from "../../models/Reservation.js";
import { Sequelize } from 'sequelize-typescript';

export const getAllTable = async (req: Request, res: Response) => {
    try {
        const table = await TableInformation.findAll({
            // paranoid: false, //ini biar tanggal deletedatnya muncul
            order: [
                ['table_number', 'ASC']
            ]
        });
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
        //kalau tetep mau munculin data yg udh dihapus
        // const table = await TableInformation.findByPk(id, {
        //     paranoid: false // Ini kuncinya! Sequelize bakal nemuin datanya meskipun sudah di-delete.
        // });

        if (!table) {
            return res.status(500).json({
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

export const addTable = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        payload.id = uuidv4();

        const { table_number, seat_count, area, status } = payload;

        if (!table_number || !seat_count || !area || !status) {
            return res.status(500).json({
                status: "Fail",
                message: "Data tidak boleh kosong"
            })
        }

        const newTable = await TableInformation.create(payload);

        return res.status(200).json({
            status: "Success",
            data: newTable
        })

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Create Table", detail: error.message })
    }
}

export const updateTable = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        //ini cuman bisa ubah beberapa
        // const { table_number, seat_count, area, status } = req.body;
        // const safePayload = { table_number, seat_count, area, status };
        // await table.update(safePayload);

        //ini buat ubah semuanya
        const { table_number, seat_count, area, status } = req.body;

        const table = await TableInformation.findByPk(id as string);

        if (!table) {
            return res.status(500).json({
                status: "Fail",
                message: "Table dengan ID tersebut tidak ditemukan"
            })
        }

        await table.update({ table_number, seat_count, area, status });
        return res.json({
            success: true,
            message: "Data Table berhasil di update",
            data: table
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get Table by ID error" })
    }
}

export const deleteTable = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const table = await TableInformation.findByPk(id as string);

        if (!table) {
            return res.status(500).json({
                status: "Fail",
                message: "Table dengan ID tersebut tidak ditemukan"
            })
        }

        await table.destroy();

        return res.json({
            success: true,
            message: "Data Table berhasil di delete",
            data: table
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get Table by ID error" })
    }
}


export const getTableAvailability = async (req: Request, res: Response) => {
    try {
        const { tanggal } = req.query;
        if (!tanggal) return res.status(400).json({ message: "Tanggal diperlukan" });

        const tables = await TableInformation.findAll({ order: [['table_number', 'ASC']] });

        const activeReservations = await Reservation.findAll({
            where: Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('tanggal_reservation')), 
                tanggal as string
            )
        });

        const plainReservations = activeReservations.map(r => r.get({ plain: true }));

        // console.log(`>>> TANGGAL DICARI: ${tanggal}`);
        // console.log(`>>> JUMLAH RESERVASI KETEMU: ${plainReservations.length}`);

        const result = tables.map(table => {
            const tableJson = table.get({ plain: true });
            
            const foundRes = plainReservations.find(res => 
                String(res.tableId) === String(tableJson.id) && 
                res.status_reservation !== 'Rejected'
            );

            if (foundRes) {
                console.log(`✅ MEJA #${tableJson.table_number} MATCH! Status: ${foundRes.status_reservation}`);
            }

            return {
                ...tableJson,
                is_booked: foundRes?.status_reservation === 'Approved',
                is_pending: foundRes?.status_reservation === 'Pending' || foundRes?.status_reservation === 'Reschedule'
            };
        });

        return res.json(result);
    } catch (error: any) {
        console.error("BACKEND ERROR:", error);
        res.status(500).json({ message: "Error", detail: error.message });
    }
}