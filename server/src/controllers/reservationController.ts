import { Reservation } from '../../models/Reservation.js';
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';


export const getAllReservation = async (req:Request, res:Response) => {
    try {
        const reservation = await Reservation.findAll();
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

        const { tanggal_reservation, jumlah_orang, tableId } = payload;
        if (!tanggal_reservation || !jumlah_orang) {
            return res.status(500).json({
                status: "Fail",
                message: "Data tidak boleh kosong"
            })
        }

        const newReservation = await Reservation.create({
            id: payload.id,
            userId: userId,
            tanggal_reservation,
            jumlah_orang,
            tableId,
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

