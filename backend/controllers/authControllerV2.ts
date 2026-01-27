import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';

const getSecret = () => process.env.JWT_SECRET || "rahasia_negara_api";

// 1. REGISTER
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const { name, password, confirmPassword } = req.body;

        // Debugging Log (Biar keliatan di terminal)
        console.log("📥 Register Request:", { name }); 

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
        }

        // Cek Duplikat (Pake name)
        const userExists: any = await User.findOne({
            where: { name: name } 
        });

        if (userExists) {
            return res.status(400).json({ msg: "Nama sudah digunakan" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser: any = await User.create({
            name: name, // Pastikan ini name
            password: hashPassword,
            role: "user",
            level: 1,
            xp: 0
        });

        const userId = newUser.id;
        const dbName = newUser.name;
        const role = newUser.role;

        const token = jwt.sign({ userId, name: dbName, role }, getSecret(), {
            expiresIn: '1d'
        });

        res.status(201).json({ msg: "Register Berhasil", token, name: dbName, role });

    } catch (error: any) {
        console.error("❌ Error Register:", error); // Biar errornya jelas
        res.status(500).json({ msg: error.message });
    }
};

// 2. LOGIN
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, password } = req.body;

        // Support login by Name OR Email
        const user: any = await User.findOne({
            where: {
                [Op.or]: [
                    { name: name },
                    { email: name }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Nama atau Email tidak ditemukan" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Password Salah" });
        }

        const userId = user.id;
        const dbName = user.name;
        const role = user.role;

        const token = jwt.sign({ userId, name: dbName, role }, getSecret(), {
            expiresIn: '1d'
        });

        res.json({ token, name: dbName, role });

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
};

// 3. GET ME
export const getMe = async (req: Request, res: Response): Promise<any> => {
    try {
        // Ambil dari middleware (pastikan middleware lu pake req.user = decoded)
        const reqUser = (req as any).user; 

        if (!reqUser || !reqUser.userId) {
            return res.status(401).json({ msg: "Mohon login akun Anda!" });
        }

        const user: any = await User.findByPk(reqUser.userId, {
            attributes: ['id', 'name', 'email', 'role', 'xp', 'level'] 
        });

        if(!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
};