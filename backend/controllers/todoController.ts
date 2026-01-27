import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
import Todo from '../models/Todo'; 
import User from '../models/User';

// ==========================================
// 1. AMBIL DATA + AUTO RESET HARIAN 🧹
// ==========================================
export const getTodos = async (req: Request, res: Response): Promise<any> => {
    try {
        // Ambil UserId dari Token (Middleware)
        const userId = (req as any).user.userId;

        // --- 🟢 LOGIKA BARU: SI TUKANG BERSIH-BERSIH ---
        // Cari jam 00:00 hari ini
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); 

        // B. Lakukan PEMBERSIHAN MASSAL (Bulk Update)
        // Logika: "Ubah jadi belum selesai (false) JIKA tugas itu sudah selesai (true) 
        // TAPI terakhir diupdate SEBELUM hari ini (yesterday logic)"
        await Todo.update(
            { completed: false }, 
            {
                where: {
                    userId: userId,
                    completed: true,
                    updatedAt: {
                        [Op.lt]: todayStart // 🔥 Op.lt (Less Than) aman disini
                    }
                }
            }
        );

        // --- 🔴 AMBIL DATA (Sesuai Request: Order Descending) ---
        const todos = await Todo.findAll({ 
            where: { userId: userId }, 
            order: [['createdAt', 'DESC']] // Data terbaru paling atas
        });

        res.json(todos);

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
            task: task,                   
            userId: (req as any).user.userId,
            completed: false
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
export const updateTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { completed } = req.body; 
        
        // Cari Todo spesifik punya user ini
        const todo: any = await Todo.findOne({ 
            where: { id: id, userId: (req as any).user.userId } 
        });

        if (!todo) {
            return res.status(404).json({ msg: "Tugas tidak ditemukan atau bukan milik Anda" });
        }

        let xpGained = 0;
        let newLevel = null;

        // --- LOGIKA GAMIFIKASI (XP & LEVEL) ---
        // Jika user mencentang selesai (completed: true) DAN sebelumnya belum selesai
        if (completed === true && todo.completed === false) {
            
            const user: any = await User.findByPk((req as any).user.userId);
            
            if (user) {
                // Tambah XP (+10)
                user.xp = (user.xp || 0) + 10; 
                xpGained = 10;
                
                // Hitung Level (Setiap 100 XP naik 1 level)
                const calculatedLevel = Math.floor(user.xp / 100) + 1;
                
                // Cek apakah Level Naik
                if (calculatedLevel > (user.level || 1)) {
                    user.level = calculatedLevel;
                    newLevel = calculatedLevel;
                }
                
                await user.save(); // Simpan data user
            }
        }

        // Update status Todo
        todo.completed = completed;
        await todo.save();
        
        // Kirim response lengkap (XP & Level buat animasi di frontend)
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