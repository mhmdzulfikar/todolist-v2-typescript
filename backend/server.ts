/* eslint-disable no-undef */
import express, { Express } from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database"; 
import rateLimit from "express-rate-limit";

// ❌ HAPUS BARIS INI (Gak perlu karena kita pake log manual di bawah)
// import listEndpoints from 'express-list-endpoints'; 

import authRoutes from './routes/authRoutes'; 
import todoRoutes from "./routes/todoRoutes";
import notificationRoutes from './routes/notificationRoutes'; 
import cardRoutes from './routes/cardRoutes'; 
import noteRoutes from './routes/noteRoutes';
import snippetRoutes from './routes/snippetRoutes';

import User from './models/User';
import Todo from './models/Todo';
import Card from './models/Card'; 
import Notification from './models/Notification';
import Note from './models/Note';
import Snippet from './models/Snippet';

dotenv.config();

const app: Express = express(); 

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300, 
    standardHeaders: true, 
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Terlalu banyak percobaan login. Tunggu sebentar!"
});

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(express.json()); 
app.use(generalLimiter);

// --- ROUTES ---
app.use('/auth', authLimiter, authRoutes);          
app.use("/todos", todoRoutes);          
app.use('/notifications', notificationRoutes); 
app.use('/cards', cardRoutes);
app.use('/notes', noteRoutes); 
app.use('/snippets', snippetRoutes);

// --- SERVER START ---
const startServer = async (): Promise<void> => { 
  try {
    await db.authenticate();
    console.log("Database Connected... ✅");

    // @ts-ignore
    User.hasMany(Todo, { foreignKey: 'userId' });
    // @ts-ignore
    Todo.belongsTo(User, { foreignKey: 'userId' });
    // @ts-ignore
    User.hasOne(Note, { foreignKey: 'userId' });
    // @ts-ignore
    Note.belongsTo(User, { foreignKey: 'userId' });
    // @ts-ignore
    User.hasMany(Snippet, { foreignKey: 'userId' });
    // @ts-ignore
    Snippet.belongsTo(User, { foreignKey: 'userId' });

    await db.sync({ alter: true });

    // 🔥 LOG MANUAL (Gak perlu install library)
    console.log("\n🔥 === ABSENSI RUTE (ROUTE CHECK) === 🔥");
    app._router.stack.forEach((r: any) => {
        if (r.route && r.route.path) {
            console.log(`[ROUTE] ${r.route.path}`);
        } else if (r.name === 'router') {
            // Cek rute daleman (Auth, Todo, dll)
            if(r.regexp.toString().includes('auth') || r.regexp.toString().includes('todos')) {
                 // console.log(`[ROUTER DETECTED]: ${r.regexp}`);
            }
            if(r.handle.stack) {
                r.handle.stack.forEach((sub: any) => {
                     if (sub.route) {
                         // Nampilin method (GET/POST) dan Path-nya
                         const method = Object.keys(sub.route.methods)[0].toUpperCase();
                         console.log(`   -> ${method} ${sub.route.path}`);
                     }
                });
            }
        }
    });
    console.log("🔥 =================================== 🔥\n");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
};

startServer();