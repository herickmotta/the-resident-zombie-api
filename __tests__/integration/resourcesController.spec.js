/* eslint-disable no-undef */
require('dotenv').config();
const supertest = require('supertest');

const sequelize = require('../../src/utils/database');

const app = require('../../src/app');

const agent = supertest(app);

jest.setTimeout(1000 * 60);

const cleatDataBase = async () => {
  await sequelize.query('DELETE FROM "survivorResources";');
  await sequelize.query('DELETE FROM flags;');
  await sequelize.query('DELETE FROM "lastLocations";');
  await sequelize.query('DELETE FROM survivors;');
};

beforeEach(async () => {
  await cleatDataBase();
});

afterAll(async () => {
  await cleatDataBase();
  await sequelize.close();
});

describe('/resources', () => {
  it('Should return resources', async () => {
    const response = await agent.get('/resources');
    expect(response.status).toBe(200);
  });
});
