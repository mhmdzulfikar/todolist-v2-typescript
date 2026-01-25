import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Atau 'bcrypt' sesuaikan library lu
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Model masih JS, nanti kita pake 'any'

// 1. LOGIC REGISTER
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, confirmPassword } = req.body;

        // Validasi simpel
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
        }

        // Cek username kembar (Pake ': any' karena Model masih JS)
        const userExists: any = await User.findOne({
            where: { username: username }
        });

        if (userExists) {
            return res.status(400).json({ msg: "Username sudah digunakan" });
        }

        // Enkripsi Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Simpan ke DB
        await User.create({
            username: username,
            password: hashPassword,
            level: 1, // Default level
            xp: 0     // Default XP
        });

        res.status(201).json({ msg: "Register Berhasil" });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

// 2. LOGIC LOGIN
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        // Cari user berdasarkan username
        const user: any = await User.findOne({
            where: { username: req.body.username }
        });

        if (!user) {
            return res.status(404).json({ msg: "Username tidak ditemukan" });
        }

        // Cek Password (Bandingkan input user vs database)
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Password Salah" });
        }

        // Bikin Token (KTP Digital)
        const userId = user.id;
        const username = user.username;
        
        // Ambil rahasia dari .env (Wajib ada process.env.JWT_SECRET)
        const secret = process.env.JWT_SECRET || "qZ!5*Yv#8tR9@Lm3%hGp^Ns&Wu$XjKLo";

        const token = jwt.sign({ userId, username }, secret, {
            expiresIn: '1d' // Token berlaku 1 hari
        });

        // Kirim Token ke Frontend
        res.json({ token });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

export const getMe = async (req: Request, res: Response): Promise<any> => {
    try {
        // 👇 CEK DISINI: Kita paksa TS anggep req punya properti user
        const reqUser = (req as any).user;

        if (!reqUser || !reqUser.userId) {
            return res.status(401).json({ msg: "Mohon login akun Anda!" });
        }

        const user: any = await User.findByPk(reqUser.userId, {
            // Pastikan nama kolom ini bener ada di database lu
            // Biasanya 'uuid' atau 'id', cek model User.js lu
            attributes: ['id', 'username', 'email', 'role', 'xp', 'level'] 
        });

        if(!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
};
