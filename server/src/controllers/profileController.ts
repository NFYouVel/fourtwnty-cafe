import { Request, Response } from "express";
import { Users } from "../../models/Users.js";
import bcrypt from "bcrypt";

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        /* VERIFY CURRENT PASSWORD */
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        /* HASH NEW PASSWORD */
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({
            password: hashedPassword
        });

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId, name } = req.body;

        if (!userId || !name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await user.update({ name });

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                user_role: user.user_role
            }
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const user = await Users.findByPk(id, {
            attributes: ["id", "name", "email", "phone", "user_role"]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message
        });
    }
};