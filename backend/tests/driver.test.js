process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Driver = require('../src/models/driver.model');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Módulo de Choferes', () => {
  // HU03 - RF03: registrar chofer
  test('debe crear un chofer con datos válidos', async () => {
    const res = await request(app).post('/api/drivers').send({
      name: 'Luis Fernández',
      license: 'L001',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Luis Fernández');
    expect(res.body.available).toBe(true); // disponible por defecto
  });

  // HU03 - criterio de aceptación: no permitir licencia duplicada
  test('no debe permitir registrar una licencia duplicada', async () => {
    await request(app).post('/api/drivers').send({ name: 'Chofer A', license: 'L100' });
    const res = await request(app).post('/api/drivers').send({ name: 'Chofer B', license: 'L100' });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/licencia/i);
  });

  // HU04 - RF04: actualizar disponibilidad
  test('debe actualizar la disponibilidad de un chofer', async () => {
    const driver = await Driver.create({ name: 'Diego Paredes', license: 'L200' });

    const res = await request(app).put(`/api/drivers/${driver.id}`).send({
      name: driver.name,
      available: false,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.available).toBe(false);
  });

  test('debe listar todos los choferes', async () => {
    const res = await request(app).get('/api/drivers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('debe eliminar un chofer existente', async () => {
    const driver = await Driver.create({ name: 'Temporal', license: 'L300' });
    const res = await request(app).delete(`/api/drivers/${driver.id}`);
    expect(res.statusCode).toBe(200);

    const check = await Driver.findByPk(driver.id);
    expect(check).toBeNull();
  });
});
