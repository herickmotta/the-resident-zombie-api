/* eslint-disable no-undef */
const sequelize = require('sequelize');

jest.mock('../../src/models/Survivor');
const Survivor = require('../../src/models/Survivor');

jest.mock('../../src/models/Resource');
const Resource = require('../../src/models/Resource');

jest.mock('../../src/models/LastLocation');
const LastLocation = require('../../src/models/LastLocation');

jest.mock('../../src/models/Flag');
const Flag = require('../../src/models/Flag');

const survivorsController = require('../../src/controllers/survivorsController');
const NotFoundError = require('../../src/errors/NotFoundError');
const ConflictError = require('../../src/errors/ConflictError');
const TradeNotEqualError = require('../../src/errors/TradeNotEqualError');
const UnauthorizedError = require('../../src/errors/UnauthorizedError');

describe('survivorController.createSurvivor', () => {
  it('Should create a survivor without errors', async () => {
    await Resource.findAll.mockResolvedValue();

    jest.spyOn(survivorsController, 'validateAndUpdateResources')
      .mockImplementation(() => []);

    await Survivor.create.mockResolvedValue({ id: 1 });
    await LastLocation.create.mockResolvedValue({});

    jest.spyOn(survivorsController, 'getSurvivorByPk')
      .mockImplementation(() => ({ id: 1 }));

    const result = await survivorsController.createSurvivor('test', 'male', {}, []);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });
});

describe('survivorController.getSurvivorByPk', () => {
  it('Should return a survivor', async () => {
    await Survivor.findByPk.mockResolvedValue({ id: 1 });

    const result = await survivorsController.getSurvivorByPk(1);
    expect(result).toEqual(expect.objectContaining({ id: 1 }));
  });

  it('Should throw NotFoundError', async () => {
    await Survivor.findByPk.mockResolvedValue(null);

    const fn = async () => {
      await survivorsController.getSurvivorByPk(null);
    };

    expect(fn).rejects.toThrow(NotFoundError);
  });
});

describe('survivorController.editSurvivorLocation', () => {
  it('Should throw NotFoundError', async () => {
    jest.spyOn(survivorsController, 'getSurvivorByPk')
      .mockImplementation(() => null);

    const fn = async () => {
      await survivorsController.editSurvivorLocation(1, {});
    };

    expect(fn).rejects.toThrow(NotFoundError);
  });

  it('Should pass without errors', async () => {
    const mockObj = { id: 1, lastLocation: { latitude: 'x', longitude: 'y' } };
    jest.spyOn(survivorsController, 'getSurvivorByPk')
      .mockImplementation(() => mockObj);

    await LastLocation.findOne.mockResolvedValue({
      lastLocation: mockObj.lastLocation,
      save: async () => Promise.resolve(),
    });

    const result = await survivorsController.editSurvivorLocation(1, { latitude: 'xx', longitude: 'yy' });

    expect(result).toEqual(expect.objectContaining(mockObj));
  });
});

describe('survivorController.flagSurvivorAsInfected', () => {
  it('Should throw ConflictError', async () => {
    const fn = async () => {
      await survivorsController.flagSurvivorAsInfected(1, 1);
    };

    expect(fn).rejects.toThrow(ConflictError);
  });

  it('Should throw NotFound Error', async () => {
    await Survivor.findByPk.mockResolvedValue(null);

    const fn = async () => {
      await survivorsController.flagSurvivorAsInfected(1, 2);
    };

    expect(fn).rejects.toThrow(NotFoundError);
  });

  it('Should pass without Errors', async () => {
    await Survivor.findByPk.mockResolvedValue({ id: 1, save: () => Promise.resolve() });
    await Flag.create.mockResolvedValue();
    await Flag.findAll.mockResolvedValue(['', '', '', '', '', '']);

    const result = await survivorsController.flagSurvivorAsInfected(1, 2);

    expect(result).toBe(undefined);
  });
});

describe('survivorController.tradeBetweenSurvivors', () => {
  const mockedResources = [
    {
      id: 1,
      points: 15,
    },
    {
      id: 2,
      points: 5,
    },
  ];
  it('Should throw TradeNotEqualError', async () => {
    const offers = [
      [{
        id: 1,
        quantity: 2,
      }],
      [{
        id: 2,
        quantity: 1,
      }],
    ];
    await Resource.findAll.mockResolvedValue(mockedResources);

    const fn = async () => {
      await survivorsController.verifyIfTradeisEqual(offers);
    };
    expect(fn).rejects.toThrow(TradeNotEqualError);
  });

  it('Should pass without Errors', async () => {
    await Resource.findAll.mockResolvedValue(mockedResources);
    const offers = [
      [{
        id: 1,
        quantity: 1,
      }],
      [{
        id: 2,
        quantity: 3,
      }],
    ];
    const result = await survivorsController.verifyIfTradeisEqual(offers);
    expect(result).toBe(undefined);
  });
});

describe('survivorController.tradeBetweenSurvivors', () => {
  it('Should throw ConflictError', async () => {
    const fn = async () => {
      await survivorsController.tradeBetweenSurvivors(1, 1, []);
    };
    expect(fn).rejects.toThrow(ConflictError);
  });

  it('Should throw UnauthorizedError', async () => {
    await jest.spyOn(survivorsController, 'getSurvivorByPk')
      .mockImplementation((id) => ({ id, isInfected: true }));

    const fn = async () => {
      await survivorsController.tradeBetweenSurvivors(1, 2, []);
    };
    expect(fn).rejects.toThrow(NotFoundError);
  });
});
