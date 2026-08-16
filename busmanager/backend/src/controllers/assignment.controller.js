const Assignment = require('../models/assignment.model');
const Route = require('../models/route.model');
const Driver = require('../models/driver.model');

// RF07 + RF08 - Crear asignación con validación de conflicto de horario
exports.createAssignment = async (req, res) => {
  try {
    const { busId, driverId, routeId, date } = req.body;

    const newRoute = await Route.findByPk(routeId);
    if (!newRoute) return res.status(404).json({ message: 'Ruta no encontrada.' });

    // RF08 - Verificar que el chofer no tenga otra ruta con horario solapado ese día
    const existingAssignments = await Assignment.findAll({
      where: { driverId, date },
      include: [{ model: Route }],
    });

    const hasConflict = existingAssignments.some((a) => {
      const r = a.Route;
      return newRoute.startTime < r.endTime && newRoute.endTime > r.startTime;
    });

    if (hasConflict) {
      return res.status(409).json({ message: 'El chofer ya tiene una ruta asignada en ese horario.' });
    }

    const assignment = await Assignment.create({ busId, driverId, routeId, date });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la asignación.', error: error.message });
  }
};

// RF10 - Listar asignaciones con chofer, autobús y ruta
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: ['Bus', 'Driver', 'Route'],
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar asignaciones.', error: error.message });
  }
};
