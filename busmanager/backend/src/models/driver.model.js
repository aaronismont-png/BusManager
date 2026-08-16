const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  license: { type: DataTypes.STRING, allowNull: false, unique: true },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'drivers', timestamps: true });

module.exports = Driver;
