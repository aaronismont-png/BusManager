const Driver = require('../models/driver.model');

// RF03 - Registrar chofer
exports.createDriver = async (req, res) => {
  try {
    const { name, license, available } = req.body;
    const existing = await Driver.findOne({ where: { license } });
    if (existing) return res.status(409).json({ message: 'Ya existe un chofer con esa licencia.' });

    const driver = await Driver.create({ name, license, available });
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el chofer.', error: error.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar choferes.', error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Chofer no encontrado.' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el chofer.', error: error.message });
  }
};

// RF04 - Actualizar disponibilidad / datos del chofer
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Chofer no encontrado.' });

    const { name, available } = req.body;
    await driver.update({ name, available });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el chofer.', error: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Chofer no encontrado.' });
    await driver.destroy();
    res.json({ message: 'Chofer eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el chofer.', error: error.message });
  }
};
