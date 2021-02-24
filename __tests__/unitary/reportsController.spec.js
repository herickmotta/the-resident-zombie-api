/* eslint-disable no-undef */

jest.mock('../../src/models/Survivor');
const Survivor = require('../../src/models/Survivor');

jest.mock('../../src/models/Resource');
const Resource = require('../../src/models/Resource');

const reportsController = require('../../src/controllers/reportsController');

jest.mock('../../src/models/SurvivorResource');
const SurvivorResource = require('../../src/models/SurvivorResource');

describe('reportsController.getSurvivorsInfo', () => {
  it('Should create a survivors report', async () => {
    await Survivor.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await reportsController.getSurvivorsInfo();
    expect(result).toEqual(expect.objectContaining({ infecteds: '50%', 'non-infecteds': '50%', total: 2 }));
  });
});

describe('reportsController.getResourcesInfo', () => {
  it('Should return a resources report', async () => {
    await SurvivorResource.findAll.mockResolvedValue([{ resourceId: 1, quantity: 1 }]);
    await Resource.findAll.mockResolvedValue([{ id: 1, name: 'resource', points: 1 }]);
    const result = await reportsController.getResourcesInfo();
    expect(result).toEqual([{
      'average-per-survivor': 1, id: '1', name: 'resource', points: 1,
    }]);
  });
});

describe('reportsController.getPointsInfo', () => {
  it('Should throw NotFoundError', async () => {
    await SurvivorResource.findAll.mockResolvedValue([{
      resourceId: 1, quantity: 1, survivor: {}, resource: { points: 1 },
    }]);
    const result = await reportsController.getPointsInfo();
    expect(result).toEqual(expect.objectContaining({ 'lost-to-infected': 0, total: 1 }));
  });
});
