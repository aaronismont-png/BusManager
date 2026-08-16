const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  origin: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  stops: { type: DataTypes.STRING, allowNull: true }, // separado por comas
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
}, { tableName: 'routes', timestamps: true });

module.exports = Route;
