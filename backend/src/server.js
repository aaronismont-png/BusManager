require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a SQL Server establecida correctamente.');

    // Sincroniza modelos con la base de datos (solo en desarrollo)
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`BusManager backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:');
    console.error(error);
    process.exit(1);
  }
}

start();
