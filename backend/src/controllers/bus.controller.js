const Bus = require('../models/bus.model');

// RF01 - Crear autobús
exports.createBus = async (req, res) => {
  try {
    const { brand, model, plate, capacity, status } = req.body;

    const existing = await Bus.findOne({ where: { plate } });
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un autobús con esa placa.' });
    }

    const bus = await Bus.create({ brand, model, plate, capacity, status });
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el autobús.', error: error.message });
  }
};

// RF09 - Listar autobuses con filtro opcional por estado
exports.getBuses = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const buses = await Bus.findAll({ where });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar autobuses.', error: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Autobús no encontrado.' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el autobús.', error: error.message });
  }
};

// RF02 - Editar autobús
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Autobús no encontrado.' });

    const { brand, model, capacity, status } = req.body; // la placa no se edita
    await bus.update({ brand, model, capacity, status });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el autobús.', error: error.message });
  }
};

// RF02 - Eliminar autobús
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Autobús no encontrado.' });

    // TODO: validar que no tenga asignaciones activas antes de eliminar
    await bus.destroy();
    res.json({ message: 'Autobús eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el autobús.', error: error.message });
  }
};
