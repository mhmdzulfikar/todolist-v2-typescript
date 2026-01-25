const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }, // <--- Jangan lupa koma
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, // <--- Jangan lupa koma
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, // <--- Jangan lupa koma
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    }, // <--- NAH, DI SINI BIASANYA LUPA KOMA SEBELUM NAMBAH BAWAHNYA
    
    // 🔥 KOLOM BARU: TRACKING LOGIN
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true
});

module.exports = User;