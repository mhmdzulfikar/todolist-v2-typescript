const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Note = db.define('Note', {
    title: {
        type: DataTypes.STRING,
        defaultValue: "Untitled"
    },
    content: {
        type: DataTypes.TEXT, // Pakai TEXT biar muat tulisan panjang
        allowNull: true
    },
    // userId nanti otomatis ditambah relasi
}, {
    freezeTableName: true
});

module.exports = Note;