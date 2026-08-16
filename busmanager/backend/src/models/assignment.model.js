const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bus = require('./bus.model');
const Driver = require('./driver.model');
const Route = require('./route.model');

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'assignments', timestamps: true });

Assignment.belongsTo(Bus, { foreignKey: 'busId' });
Assignment.belongsTo(Driver, { foreignKey: 'driverId' });
Assignment.belongsTo(Route, { foreignKey: 'routeId' });

module.exports = Assignment;
