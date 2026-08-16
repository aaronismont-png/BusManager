const express = require('express');
const cors = require('cors');

const busRoutes = require('./routes/bus.routes');
const driverRoutes = require('./routes/driver.routes');
const routeRoutes = require('./routes/route.routes');
const assignmentRoutes = require('./routes/assignment.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'busmanager-backend' });
});

app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/assignments', assignmentRoutes);

module.exports = app;
