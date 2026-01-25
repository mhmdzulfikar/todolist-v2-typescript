import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
// Kalau Model lu masih JS, kadang TS minta pake require. 
// Tapi kalau 'allowJs' udah true, coba pake import ini dulu:
import Todo from '../models/Todo'; 
import User from '../models/User';

// --- Trik biar TS gak marah soal 'req.user' ---
// Kita bikin interface custom (opsional, tapi good practice)
interface AuthRequest extends Request {
    user?: {
        userId: number;
    }
}

// ==========================================
// 1. AMBIL DATA + AUTO RESET HARIAN 🧹
// ==========================================
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        // Pake 'as any' adalah jalan pintas biar TS gak rewel nanyain "user itu apa?"
        const userId = (req as any).user.userId;

        // --- 🟢 LOGIKA BARU: SI TUKANG BERSIH-BERSIH ---
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); 

        // B. Lakukan PEMBERSIHAN MASSAL (Bulk Update)
        await Todo.update(
            { completed: false }, 
            {
                where: {
                    userId: userId,
                    completed: true,
                    updatedAt: {
                        [Op.lt]: todayStart // 🔥 Op.lt harusnya udah aman sekarang
                    }
                }
            }
        );

        // --- 🔴 LOGIKA LAMA (AMBIL DATA) ---
        const todos = await Todo.findAll({ 
            where: { userId: userId }, 
            order: [['createdAt', 'DESC']] 
        });

        res.json(todos); // Gak perlu return response, cukup panggil res.json

    } catch (error: any) {
        console.error("Error Get Todos:", error);
        res.status(500).json({ message: "Gagal mengambil data tugas" });
    }
};

// ==========================================
// 2. TAMBAH TUGAS
// ==========================================
export const createTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { task } = req.body; 
        
        if (!task || task.trim() === "") {
            return res.status(400).json({ message: "Isi tugas tidak boleh kosong" });
        }

        const newTodo = await Todo.create({ 
            task,                   
            userId: (req as any).user.userId 
        });

        res.status(201).json(newTodo);
    } catch (error: any) {
        console.error("Error Create Todo:", error);
        res.status(500).json({ message: "Gagal menambah tugas" });
    }
};

// ==========================================
// 3. UPDATE TUGAS + SISTEM LEVEL UP 🎮
// ==========================================
// ==========================================
// 3. UPDATE TUGAS + SISTEM LEVEL UP 🎮
// ==========================================
export const updateTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { completed } = req.body; 
        
        // 🔥 TRIKNYA DISINI: Tambahin ': any' setelah nama variable
        // Biar TS gak protes pas kita panggil todo.completed nanti
        const todo: any = await Todo.findOne({ 
            where: { id, userId: (req as any).user.userId } 
        });

        if (!todo) {
            return res.status(404).json({ msg: "Tugas tidak ditemukan atau bukan milik Anda" });
        }

        let xpGained = 0;
        let newLevel = null;

        // Sekarang todo.completed GAK BAKAL MERAH lagi
        if (completed === true && todo.completed === false) {
            
            // 🔥 INI JUGA: Kasih ': any' ke user
            const user: any = await User.findByPk((req as any).user.userId);
            
            if (user) {
                // user.xp dan user.level sekarang aman
                user.xp = (user.xp || 0) + 10; 
                xpGained = 10;
                
                const calculatedLevel = Math.floor(user.xp / 100) + 1;
                
                if (calculatedLevel > (user.level || 1)) {
                    user.level = calculatedLevel;
                    newLevel = calculatedLevel;
                }
                await user.save(); 
            }
        }

        todo.completed = completed;
        await todo.save();
        
        res.json({ message: "Status updated", xpGained, newLevel });

    } catch (error: any) {
        console.error("Error Update Todo:", error);
        res.status(500).json({ message: "Gagal update tugas" });
    }
};

// ==========================================
// 4. HAPUS TUGAS
// ==========================================
export const deleteTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await Todo.destroy({
            where: { id: req.params.id, userId: (req as any).user.userId }
        });

        if (result === 0) {
            return res.status(404).json({ message: "Tugas tidak ditemukan" });
        }

        res.json({ message: "Todo Deleted" });
    } catch (error: any) {
        console.error("Error Delete Todo:", error);
        res.status(500).json({ message: "Gagal menghapus tugas" });
    }
};