const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Notification = db.define('Notification', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('admin', 'success', 'warning'),
        defaultValue: 'admin'
    }
    // Waktu (createdAt) otomatis dibuat sama Sequelize
}, {
    freezeTableName: true
});

module.exports = Notification;