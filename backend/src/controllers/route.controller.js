const Route = require('../models/route.model');

// RF05 - Crear ruta
exports.createRoute = async (req, res) => {
  try {
    const { origin, destination, stops, startTime, endTime } = req.body;

    if (endTime <= startTime) {
      return res.status(400).json({ message: 'La hora de fin debe ser posterior a la hora de inicio.' });
    }

    const route = await Route.create({ origin, destination, stops, startTime, endTime });
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la ruta.', error: error.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar rutas.', error: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada.' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la ruta.', error: error.message });
  }
};

// RF06 - Editar ruta
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada.' });

    const { origin, destination, stops, startTime, endTime } = req.body;
    await route.update({ origin, destination, stops, startTime, endTime });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la ruta.', error: error.message });
  }
};

// RF06 - Eliminar ruta
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada.' });
    // TODO: validar que no tenga asignaciones activas antes de eliminar
    await route.destroy();
    res.json({ message: 'Ruta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la ruta.', error: error.message });
  }
};
