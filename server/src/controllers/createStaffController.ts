import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { Users } from '../../models/Users.js';

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const staff = await Users.findAll({
            where: {
                user_role: 'Staff'
            },
            attributes: {
                exclude: ['password'] //ini passwordnya ga dimunculin
            }
        })
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get All Staff error" });
    }
}

export const getStaffById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const staff = await Users.findOne({
            where:{
                id: id,
                user_role: 'Staff'
            },
            attributes: {
                exclude: ['password']
            }
        })

        if (!staff) {
            return res.status(500).json({
                status: "fail",
                message: "Staff dengan ID tersebut tidak ditemukan"
            })
        }

        return res.status(200).json({
            status: "Success",
            data: staff
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get staff by ID error" });
    }
}

export const createStaff = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        payload.id = uuidv4();

        const { name, email, password, phone} = payload;
        const hashedPassword = await bcrypt.hash(password, 10);
        payload.user_role = 'Staff';
        payload.password = hashedPassword;

        if (!name || !email || !password || !phone) {
            return res.status(500).json({
                status: "Fail",
                message: "Data tidak boleh kosong"
            })
        }

        const newStaff = await Users.create({
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            phone,
            user_role: 'Staff'
        });

        return res.status(200).json({
            success: true,
            message: "Staff berhasil di daftarkan",
            data: {
                id: newStaff.id,
                name: newStaff.name,
                email: newStaff.email,
                user_role: newStaff.user_role
            }
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Gagal Create Staff", detail: error.message })
    }
}

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {name, email, phone} = req.body;
        const staff = await Users.findOne({
            where:{
                id: id,
                user_role: 'Staff'
            },
            attributes: {
                exclude: ['password']
            }
        })

        if (!staff) {
            return res.status(500).json({
                status: "fail",
                message: "Staff dengan ID tersebut tidak ditemukan"
            })
        }

        await staff.update({name, email, phone});
        return res.json({
            success: true,
            message: "Data Staff berhasil di update",
            data: staff
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get Staff by ID error" })
    }
}

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const staff = await Users.findOne({
            where: {
                id:id,
                user_role:'Staff'
            },
            attributes: {
                exclude: ['password']
            }
        })

        if (!staff) {
            return res.status(500).json({
                status: "fail",
                message: "Staff dengan ID tersebut tidak ditemukan"
            })
        }

        await staff.destroy();

        return res.json({
            success: true,
            message: "Data Staff berhasil di delete",
            data: staff
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get Table by ID error" })
    }
}