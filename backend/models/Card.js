const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Card = db.define('Card', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: 'bg-blue-500'
    },
    status: { 
        type: DataTypes.ENUM('progress', 'future'), 
        defaultValue: 'progress' 
    }
}, {
    freezeTableName: true
});

// 🔥 THIS IS THE KEY FIX: Export the model directly
module.exports = Card;