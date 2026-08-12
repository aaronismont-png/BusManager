process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Bus = require('../src/models/bus.model');
const Driver = require('../src/models/driver.model');
const Route = require('../src/models/route.model');

let bus, driver, routeA, routeB, routeOverlap;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  bus = await Bus.create({ brand: 'Mercedes-Benz', model: 'O500', plate: 'A100000', capacity: 40 });
  driver = await Driver.create({ name: 'Luis Fernández', license: 'L500' });

  routeA = await Route.create({ origin: 'Santo Domingo', destination: 'Santiago', startTime: '08:00', endTime: '10:00' });
  routeB = await Route.create({ origin: 'Santo Domingo', destination: 'La Romana', startTime: '11:00', endTime: '13:00' });
  routeOverlap = await Route.create({ origin: 'Santo Domingo', destination: 'Higüey', startTime: '09:00', endTime: '11:30' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Módulo de Asignaciones', () => {
  // HU07 - RF07: asignar chofer y autobús a una ruta
  test('debe crear una asignación válida', async () => {
    const res = await request(app).post('/api/assignments').send({
      busId: bus.id,
      driverId: driver.id,
      routeId: routeA.id,
      date: '2026-08-20',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.routeId).toBe(routeA.id);
  });

  // HU08 - RF08: no debe permitir un chofer con horarios que se solapen el mismo día
  test('no debe permitir asignar al mismo chofer una ruta con horario solapado el mismo día', async () => {
    // routeOverlap (09:00-11:30) se solapa con routeA (08:00-10:00)
    const res = await request(app).post('/api/assignments').send({
      busId: bus.id,
      driverId: driver.id,
      routeId: routeOverlap.id,
      date: '2026-08-20', // mismo día que la asignación anterior
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/horario/i);
  });

  // HU08 - debe permitir la asignación si no hay solapamiento
  test('debe permitir asignar al mismo chofer una ruta sin solapamiento de horario', async () => {
    // routeB (11:00-13:00) no se solapa con routeA (08:00-10:00)
    const res = await request(app).post('/api/assignments').send({
      busId: bus.id,
      driverId: driver.id,
      routeId: routeB.id,
      date: '2026-08-20',
    });

    expect(res.statusCode).toBe(201);
  });

  // HU08 - debe permitir el mismo horario si es otro día
  test('debe permitir el mismo horario de ruta en un día distinto', async () => {
    const res = await request(app).post('/api/assignments').send({
      busId: bus.id,
      driverId: driver.id,
      routeId: routeA.id,
      date: '2026-08-21', // día distinto
    });

    expect(res.statusCode).toBe(201);
  });

  // HU10 - RF10: listar asignaciones con datos relacionados
  test('debe listar las asignaciones con los datos de bus, chofer y ruta', async () => {
    const res = await request(app).get('/api/assignments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
