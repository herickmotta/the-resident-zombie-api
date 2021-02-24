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

describe('/survivors', () => {
  it('Should return 422 if input data is incorrect', async () => {
    const body = {
      name: 'survivor',
    };

    const response = await agent.post('/survivors').send(body);
    expect(response.status).toBe(422);
  });

  it('Should return 201 when create a survivor', async () => {
    const body = {
      name: 'survivor 2',
      gender: 'male',
      lastLocation: {
        longitude: '+12516216',
        latitude: '-1255151',
      },
      resources: [
        {
          id: 2,
          quantity: 1,
        },
        {
          id: 4,
          quantity: 1,
        },
      ],
    };

    const response = await agent.post('/survivors').send(body);
    expect(response.status).toBe(201);
  });
});

describe('/survivors/:id', () => {
  it('Should return 404 if survivor does not exist', async () => {
    const response = await agent.get('/survivors/1');
    expect(response.status).toBe(404);
  });

  it('Should return 200 when returning a survivor', async () => {
    const insertSurvivor = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id } = insertSurvivor[0][0];
    const response = await agent.get(`/survivors/${id}`);
    expect(response.status).toBe(200);
  });
});

describe('/survivors/:id/lastlocations', () => {
  it('Should return 404 if survivor does not exist', async () => {
    const response = await agent.put('/survivors/1');
    expect(response.status).toBe(404);
  });

  it('Should return 200 when updating a survivor location', async () => {
    const insertSurvivor = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId } = insertSurvivor[0][0];
    await sequelize.query('INSERT INTO "lastLocations" ("survivorId",latitude,longitude) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId, 'x', 'y'] });
    const body = {
      lastLocation: {
        latitude: 'xx',
        longitude: 'yy',
      },
    };
    const response = await agent.put(`/survivors/${survivorId}/lastLocations`).send(body);
    expect(response.status).toBe(200);
  });

  it('Should return 422 when is missing location', async () => {
    const insertSurvivor = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId } = insertSurvivor[0][0];
    await sequelize.query('INSERT INTO "lastLocations" ("survivorId",latitude,longitude) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId, 'x', 'y'] });
    const body = {

    };
    const response = await agent.put(`/survivors/${survivorId}/lastLocations`).send(body);
    expect(response.status).toBe(422);
  });
});

describe('/survivors/:id/flags/survivors/:id', () => {
  it('Should return 404 if survivor does not exist', async () => {
    const response = await agent.post('/survivors/1/flags/survivors/2');
    expect(response.status).toBe(404);
  });

  it('Should return 200 when a survivor flag another one', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    const response = await agent.post(`/survivors/${survivorId1}/flags/survivors/${survivorId2}`).send({});
    expect(response.status).toBe(200);
  });

  it('Should return 409 when a survivor tries to flag hiself', async () => {
    const insertSurvivor = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId } = insertSurvivor[0][0];
    const response = await agent.post(`/survivors/${survivorId}/flags/survivors/${survivorId}`).send({});
    expect(response.status).toBe(409);
  });
});

describe('/survivors/:id/trades/survivors/:id', () => {
  it('Should return 404 if survivor does not exist', async () => {
    const response = await agent.post('/survivors/1/flags/survivors/2');
    expect(response.status).toBe(404);
  });

  it('Should return 200 when a survivor trades another one', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 10] });

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId2, 3, 10] });

    const body = {
      survivor1Offers: [{
        id: 3,
        quantity: 5,
      }],
      survivor2Offers: [{
        id: 3,
        quantity: 5,
      }],
    };
    const response = await agent.post(`/survivors/${survivorId1}/trades/survivors/${survivorId2}`).send(body);
    expect(response.status).toBe(200);
  });

  it('Should return 409 when a survivor tries to trade himself', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId1 } = insertSurvivor1[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 10] });

    const body = {
      survivor1Offers: {
        id: 3,
        quantity: 5,
      },
      survivor2Offers: {
        id: 3,
        quantity: 5,
      },
    };
    const response = await agent.post(`/survivors/${survivorId1}/trades/survivors/${survivorId1}`).send(body);
    expect(response.status).toBe(409);
  });

  it('Should return 500 when a survivor trades a item that dos not exist', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 0] });

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId2, 3, 10] });

    const body = {
      survivor1Offers: [{
        id: 3,
        quantity: 5,
      }],
      survivor2Offers: [{
        id: 3,
        quantity: 5,
      }],
    };
    const response = await agent.post(`/survivors/${survivorId1}/trades/survivors/${survivorId2}`).send(body);
    expect(response.status).toBe(500);
  });

  it('Should return 401 when a infected tries to trade', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender,"isInfected") VALUES ($1,$2,$3) RETURNING id', { bind: ['name', 'gender', true] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 0] });

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId2, 3, 10] });

    const body = {
      survivor1Offers: [{
        id: 3,
        quantity: 5,
      }],
      survivor2Offers: [{
        id: 3,
        quantity: 5,
      }],
    };
    const response = await agent.post(`/survivors/${survivorId1}/trades/survivors/${survivorId2}`).send(body);
    expect(response.status).toBe(401);
  });

  it('Should return 422 when a trade does not match', async () => {
    const insertSurvivor1 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId1 } = insertSurvivor1[0][0];
    const insertSurvivor2 = await sequelize.query('INSERT INTO survivors (name,gender) VALUES ($1,$2) RETURNING id', { bind: ['name', 'gender'] });
    const { id: survivorId2 } = insertSurvivor2[0][0];

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId1, 3, 0] });

    await sequelize.query('INSERT INTO "survivorResources" ("survivorId","resourceId",quantity) VALUES ($1,$2,$3) RETURNING id', { bind: [survivorId2, 3, 10] });

    const body = {
      survivor1Offers: [{
        id: 3,
        quantity: 4,
      }],
      survivor2Offers: [{
        id: 3,
        quantity: 5,
      }],
    };
    const response = await agent.post(`/survivors/${survivorId1}/trades/survivors/${survivorId2}`).send(body);
    expect(response.status).toBe(422);
  });
});
