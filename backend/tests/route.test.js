process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Route = require('../src/models/route.model');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Módulo de Rutas', () => {
  // HU05 - RF05: crear ruta
  test('debe crear una ruta con datos válidos', async () => {
    const res = await request(app).post('/api/routes').send({
      origin: 'Santo Domingo',
      destination: 'Santiago',
      stops: 'La Vega, Bonao',
      startTime: '08:00',
      endTime: '10:30',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.origin).toBe('Santo Domingo');
  });

  // HU05 - criterio de aceptación: hora de fin debe ser posterior a la de inicio
  test('no debe permitir una ruta con hora de fin anterior a la de inicio', async () => {
    const res = await request(app).post('/api/routes').send({
      origin: 'Santo Domingo',
      destination: 'Puerto Plata',
      stops: '',
      startTime: '15:00',
      endTime: '10:00',
    });

    expect(res.statusCode).toBe(400);
  });

  // HU06 - RF06: editar ruta
  test('debe editar una ruta existente', async () => {
    const route = await Route.create({
      origin: 'Santo Domingo',
      destination: 'San Cristóbal',
      stops: '',
      startTime: '06:00',
      endTime: '07:00',
    });

    const res = await request(app).put(`/api/routes/${route.id}`).send({
      origin: 'Santo Domingo',
      destination: 'San Cristóbal',
      stops: 'Haina',
      startTime: '06:00',
      endTime: '07:30',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.stops).toBe('Haina');
  });

  // HU06 - RF06: eliminar ruta
  test('debe eliminar una ruta existente', async () => {
    const route = await Route.create({
      origin: 'Santo Domingo',
      destination: 'Baní',
      stops: '',
      startTime: '09:00',
      endTime: '10:00',
    });

    const res = await request(app).delete(`/api/routes/${route.id}`);
    expect(res.statusCode).toBe(200);

    const check = await Route.findByPk(route.id);
    expect(check).toBeNull();
  });

  test('debe listar todas las rutas', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
