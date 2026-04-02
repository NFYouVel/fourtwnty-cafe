import { Users } from "../../models/Users.js"
import { Request, Response } from "express";
import bcrypt from "bcrypt";
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
                role: user.getDataValue("role")
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
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await Users.findAll(); // Find All itu bawaan dari express buat ngambil semua datanya
        res.json(users); // Ini buat return semua users dalam bentuk objek 
    } catch (error) {
        res.status(500).json({ message: "Error fetching all users." });
    }
}

// POST /users
export const createUser = async (req: Request, res: Response) => {
    try {
        console.log("BODY:", req.body);

        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            name,
            email,
            password: hashedPassword
        });

        console.log("CREATED:", user.toJSON()); // 👈 HARUS MUNCUL

        res.status(201).json(user);
    } catch (error) {
        console.error("ERROR DETAIL:", error); // 🔥 INI PENTING
        res.status(500).json({ message: "Error creating user" });
    }
};