const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');


describe('API AutovendaAI', () => {
  beforeAll(async () => {
    await app.locals.mongoConnection;
  });

  afterAll(async () => {
    if (app.locals.autoSalesTask) {
      app.locals.autoSalesTask.stop();
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });





  it('deve listar produtos', async () => {
    const res = await request(app)
      .get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 20000);
});
