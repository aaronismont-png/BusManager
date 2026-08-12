const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.NODE_ENV === 'test'
  ? (process.env.DB_TEST_NAME || 'busmanager_test')
  : process.env.DB_NAME;

const sequelize = new Sequelize(
  dbName,
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
