import { Request, Response, NextFunction } from 'express'; // 1. Import Tipe Data Express
import jwt from 'jsonwebtoken'; // 2. Ganti require jadi import

// 3. Ganti 'const verifyToken = ...' jadi 'export const verifyToken = ...'
export const verifyToken = (req: Request, res: Response, next: NextFunction) => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ msg: "Belum Login / Gak Ada Token" });

    const secret = process.env.JWT_SECRET || "rahasia_negara_api";

    // Tambahin tipe data any buat err & decoded biar TS ga rewel
    jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ msg: "Token Salah / Kadaluarsa" });
        
        // 4. Pake (req as any) karena secara default Request ga punya properti 'user'
        (req as any).user = decoded; 
        next();
    });
};