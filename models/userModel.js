// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
}, {
  tableName: 'users', // Nom exact de la table dans la base
  freezeTableName: true, // Empêche Sequelize de modifier le nom
  timestamps: false // Désactive createdAt et updatedAt si pas dans ta table
});

module.exports = User;
