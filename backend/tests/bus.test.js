process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Bus = require('../src/models/bus.model');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // recrea las tablas en la BD de pruebas
});

afterAll(async () => {
  await sequelize.close();
});

describe('Módulo de Autobuses', () => {
  // HU01 - RF01: crear autobús
  test('debe crear un autobús con datos válidos', async () => {
    const res = await request(app).post('/api/buses').send({
      brand: 'Mercedes-Benz',
      model: 'O500',
      plate: 'A123456',
      capacity: 40,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.plate).toBe('A123456');
    expect(res.body.status).toBe('activo'); // valor por defecto
  });

  // HU01 - criterio de aceptación: no permitir placa duplicada
  test('no debe permitir registrar una placa duplicada', async () => {
    await request(app).post('/api/buses').send({
      brand: 'Volvo',
      model: 'B270F',
      plate: 'B999999',
      capacity: 35,
    });

    const res = await request(app).post('/api/buses').send({
      brand: 'Scania',
      model: 'K310',
      plate: 'B999999', // misma placa
      capacity: 45,
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/placa/i);
  });

  // RF09: listar autobuses con filtro por estado
  test('debe listar autobuses y permitir filtrar por estado', async () => {
    const res = await request(app).get('/api/buses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    const filtered = await request(app).get('/api/buses?status=activo');
    expect(filtered.statusCode).toBe(200);
    filtered.body.forEach((bus) => {
      expect(bus.status).toBe('activo');
    });
  });

  // RF02: editar autobús (la placa no debe poder cambiarse)
  test('debe editar un autobús existente sin modificar la placa', async () => {
    const bus = await Bus.create({
      brand: 'Iveco',
      model: 'Daily',
      plate: 'C111111',
      capacity: 20,
    });

    const res = await request(app).put(`/api/buses/${bus.id}`).send({
      brand: 'Iveco',
      model: 'Daily Updated',
      capacity: 22,
      status: 'mantenimiento',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.model).toBe('Daily Updated');
    expect(res.body.capacity).toBe(22);
    expect(res.body.plate).toBe('C111111'); // no cambió
  });

  // RF02: eliminar autobús
  test('debe eliminar un autobús existente', async () => {
    const bus = await Bus.create({
      brand: 'Hyundai',
      model: 'County',
      plate: 'D222222',
      capacity: 25,
    });

    const res = await request(app).delete(`/api/buses/${bus.id}`);
    expect(res.statusCode).toBe(200);

    const check = await Bus.findByPk(bus.id);
    expect(check).toBeNull();
  });

  test('debe devolver 404 al intentar obtener un autobús inexistente', async () => {
    const res = await request(app).get('/api/buses/99999');
    expect(res.statusCode).toBe(404);
  });
});
