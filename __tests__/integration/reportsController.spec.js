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

describe('/reports/survivors', () => {
  it('Should return survivors data', async () => {
    await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });

    const response = await agent.get('/reports/survivors');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ survivors: { total: 2, 'non-infecteds': '100%', infecteds: '0%' } }));
  });
});

describe('/reports/resources', () => {
  it('Should return resources data', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender,"isInfected") VALUES ($1,$2,$3) RETURNING id', { bind: ['name', 'gender', true] });
    const { id: survivorId1 } = insertSurvivor1[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 1, 10] });
    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 2, 10] });
    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 10] });
    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 4, 10] });
    const response = await agent.get('/reports/resources');
    expect(response.body).toEqual(expect.objectContaining({
      resources: [{
        'average-per-survivor': 10, id: '1', name: 'Fiji Water', points: 14,
      }, {
        'average-per-survivor': 10, id: '2', name: 'Campbell Soup', points: 12,
      }, {
        'average-per-survivor': 10, id: '3', name: 'First Aid Pouch', points: 10,
      }, {
        'average-per-survivor': 10, id: '4', name: 'AK47', points: 8,
      }],
    }));
  });
});

describe('/reports/resources', () => {
  it('Should return resources data', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender,"isInfected") VALUES ($1,$2,$3) RETURNING id', { bind: ['name', 'gender', true] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 10] });

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId2, 3, 10] });
    const response = await agent.get('/reports/points');
    expect(response.body).toEqual(expect.objectContaining({ points: { total: 200, 'lost-to-infected': 100 } }));
  });
});
