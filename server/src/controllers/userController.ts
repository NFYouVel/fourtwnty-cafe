import { Users } from "../../models/Users.js"
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //  1. Search User
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with that email not found!" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.getDataValue("password"));
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // 3. Create token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }
        const token = jwt.sign(
            {
                id: user.getDataValue("id"),
                email: user.getDataValue("email"),
                role: user.getDataValue("user_role")
            },
            process.env.JWT_SECRET, // nanti kita pindahin ke .env
            { expiresIn: "1d" }
        );

        // 4. response
        res.json({
            message: "Login success",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login error" });
    }
};

// GET /users
export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;

        const user = await Users.findOne({
            where: { email },
            attributes: {
                exclude: ["password"]
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
    try {
        console.log("BODY:", req.body);

        const { name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        console.log("CREATED:", user.toJSON());

        res.status(201).json(user);
    } catch (error) {
        console.error("ERROR DETAIL:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};

/* ===============================
   SEND RESET CODE TO EMAIL
================================= */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email wajib diisi" });
        }

        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        await user.update({ reset_code: resetCode });

        const transporter =
            nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject:
                "Fourtwnty Cafe Password Reset",
            html: `
                <div style="font-family:Arial;padding:20px">
                    <h2>Password Reset</h2>
                    <p>Your verification code:</p>
                    <h1 style="letter-spacing:5px;color:#8f624e">
                        ${resetCode}
                    </h1>
                    <p>This code is valid for 5 minutes.</p>
                </div>
            `
        });

        res.json({
            success: true,
            message:
                "Kode verifikasi berhasil dikirim"
        });

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message });

    }
};

/* ===============================
   VERIFY CODE
================================= */
export const verifyResetCode = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, code } = req.body;

        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        if (
            user.getDataValue("reset_code") !==
            code
        ) {
            return res.status(400).json({
                message: "Kode salah"
            });
        }

        res.json({
            success: true,
            message: "Kode valid"
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* ===============================
   RESET PASSWORD
================================= */
export const resetPassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } =
            req.body;

        const user = await Users.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await user.update({
            password: hashedPassword,
            reset_code: null
        });

        res.json({
            success: true,
            message:
                "Password berhasil diubah"
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};
