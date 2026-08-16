const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand: { type: DataTypes.STRING, allowNull: false },      // marca
  model: { type: DataTypes.STRING, allowNull: false },      // modelo
  plate: { type: DataTypes.STRING, allowNull: false, unique: true }, // placa
  capacity: { type: DataTypes.INTEGER, allowNull: false },  // capacidad
  status: {
    type: DataTypes.ENUM('activo', 'mantenimiento', 'inactivo'),
    defaultValue: 'activo',
  },
}, {
  tableName: 'buses',
  timestamps: true,
});

module.exports = Bus;
