const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Todo = db.define('Todo', {
    // ID biasanya otomatis dibuatkan
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    freezeTableName: true // Biar nama tabelnya tetep 'Todo', bukan 'Todos'
});

module.exports = Todo;