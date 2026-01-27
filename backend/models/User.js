const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    // 🔥 KITA BALIK PAKE 'name' (Sesuai keinginan Database lu)
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false 
    },
    
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    },
    
    // TRACKING & XP
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