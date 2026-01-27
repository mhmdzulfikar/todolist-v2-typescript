const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// 👇 KITA PAKE DATA NEON DB LU (Biar gak pusing mikirin password local)
const dbName = 'neondb';
const dbUser = 'neondb_owner';
const dbPass = 'npg_4LyVuErGcqS1'; 
const dbHost = 'ep-bold-haze-a1vqhfhi-pooler.ap-southeast-1.aws.neon.tech';

const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
    logging: console.log,
    
    // ⚠️ KALAU PAKE NEON, SSL HARUS NYALA (TRUE)
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
});

module.exports = db;