import { Reservation } from '../../models/Reservation.js';
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { TableInformation } from '../../models/TableInformation.js';
import { Users } from '../../models/Users.js';


export const getAllReservation = async (req:Request, res:Response) => {
    try {
        const reservation = await Reservation.findAll({
            //buat ambil nama sama no meja
            include: [
                {
                    model: Users,
                    attributes: ['name']
                },
                {
                    model: TableInformation,
                    attributes: ['table_number']
                }
            ]
        });
        res.json(reservation);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Get All Reservation error", detail: error.message })
    }
}

export const createReservation = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        payload.id = uuidv4();
        const userId = (req as any).user.id;

        const { tanggal_reservation, jumlah_orang, table_number } = payload;
        if (!tanggal_reservation || !jumlah_orang) {
            return res.status(500).json({
                status: "Fail",
                message: "Data tidak boleh kosong"
            })
        }

        const table = await TableInformation.findOne({
            where: {
                table_number: table_number
            }
        })

        if (!table) {
            return res.status(404).json({
                status: "Fail",
                message: `Meja nomor #${table_number} tidak di temukan`
            })
        }


        const newReservation = await Reservation.create({
            id: payload.id,
            userId: userId,
            tanggal_reservation,
            jumlah_orang,
            tableId: table.id,
            status_reservation: 'Pending'
        })

        return res.status(200).json({
            status: "Success",
            message: "Berhasil Create Reservation",
            data: newReservation
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Create Reservation", detail: error.message })
    }
}

export const staffUpdateReservationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status_reservation} = req.body;

        const reservation = await Reservation.findByPk(id as string);
        if (!reservation) {
            return res.status(500).json({
                message: "Data reservation tidak di temukan"
            })
        }

        await reservation.update({
            status_reservation
        })

        return res.json({
            success: true,
            message: "Update reservation status",
            data: reservation
        })

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Approve Reservation", detail: error.message })
    }
}

export const requestReschedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tanggal_reschedule } = req.body;

        const userId = (req as any).user.id;

        const reservation = await Reservation.findOne({
            where: {
                id,
                userId
            }
        })

        if (!reservation) {
            return res.status(500).json({
                message: "Reservasi tidak terdaftar"
            })
        }

        await reservation.update({
            tanggal_reschedule,
            status: 'Reschedule'
        })

        return res.json({
            status: 'Success',
            message: "Request tanggal reschedule",
            data: reservation
        })

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Reschedule ", detail: error.message })
    }
}

export const getUserReservations = async (req:Request, res: Response) => {
    try {
        const userId = req.params.id;

        const reservations = await Reservation.findAll({
            where: {
                userId: userId,
            },
            include: [
                {
                    model:TableInformation,
                    attributes: ['table_number', 'area']
                }
            ],
            order: [['tanggal_reservation', 'DESC']]
        })

        res.json({
            status: "Success",
            data: reservations
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Memuat Reservation ", detail: error.message })
    }
}

export const deleteReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id as string);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation tidak ditemukan"
            });
        }

        await reservation.destroy();

        return res.status(200).json({
            success: true,
            message: "Reservation berhasil dihapus",
            data: reservation
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus reservation",
            detail: error.message
        });
    }
};