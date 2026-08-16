const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        instanceName: process.env.DB_INSTANCE || undefined,
        encrypt: false, // true si usas Azure SQL o requieres conexión cifrada
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

module.exports = sequelize;
