/* eslint-disable no-param-reassign */
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const TradeNotEqualError = require('../errors/TradeNotEqualError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const Flag = require('../models/Flag');
const LastLocation = require('../models/LastLocation');
const Resource = require('../models/Resource');
const Survivor = require('../models/Survivor');
const SurvivorResource = require('../models/SurvivorResource');
const sequelize = require('../utils/database');

class SurvivorsController {
  async createSurvivor(survivorParams) {
    const {
      name, gender, lastLocation, resources,
    } = survivorParams;

    const allResources = await Resource.findAll();
    const updatedResources = this.validateAndUpdateResources(resources, allResources);

    const { id } = await Survivor.create({ name, gender });
    await LastLocation.create({ survivorId: id, ...lastLocation });
    const promises = updatedResources.map((r) => (
      SurvivorResource.create({ survivorId: id, resourceId: r.id, quantity: r.quantity })
    ));
    await Promise.all(promises);
    return this.getSurvivorByPk(id);
  }

  validateAndUpdateResources(resources, allResources) {
    const validIds = allResources.map((r) => r.id);
    return validIds.map((validId) => {
      const resource = resources.find((r) => r.id === validId);
      if (resource) {
        return { id: validId, quantity: resource.quantity };
      }
      return { id: validId, quantity: 0 };
    });
  }

  async getSurvivorByPk(id) {
    const survivor = await Survivor.findByPk(id, {
      attributes: ['id', 'name', 'gender', 'isInfected'],
      include: [
        {
          model: SurvivorResource,
          as: 'resources',
          attributes: ['resourceId', 'quantity'],
          include: {
            model: Resource,
            attributes: ['id', 'name', 'points'],
          },
        },
        {
          model: LastLocation,
          as: 'lastLocation',
          attributes: ['latitude', 'longitude'],
        }],
    });
    if (!survivor) throw new NotFoundError();
    return survivor;
  }

  async editSurvivorLocation(survivorId, newLocation) {
    const survivor = await this.getSurvivorByPk(survivorId);
    if (!survivor) throw new NotFoundError();
    const location = await LastLocation.findOne({ where: { survivorId } });
    location.latitude = newLocation.latitude;
    location.longitude = newLocation.longitude;
    await location.save();
    return this.getSurvivorByPk(survivorId);
  }

  async flagSurvivorAsInfected(survivorId, infectedId) {
    if (survivorId === infectedId) throw new ConflictError();

    const survivor = await Survivor.findByPk(survivorId);
    if (!survivor) throw new NotFoundError();

    const infected = await Survivor.findByPk(infectedId);
    if (!infected) throw new NotFoundError();

    await Flag.create({ survivorId: infectedId });
    const flags = await Flag.findAll({ where: { survivorId: infectedId } });
    if (flags.length >= 5) {
      infected.isInfected = true;
      infected.save();
    }
  }

  async tradeBetweenSurvivors(survivor1Id, survivor2Id, tradeResources) {
    const t = await sequelize.transaction();
    try {
      if (survivor1Id === survivor2Id) throw new ConflictError('Trade with yourself is forbidden');
      const { survivor1Offers, survivor2Offers } = tradeResources;
      const survivor1 = await this.getSurvivorByPk(survivor1Id);
      const survivor2 = await this.getSurvivorByPk(survivor2Id);
      if (survivor1.isInfected || survivor2.isInfected) throw new UnauthorizedError("Infected survivors can't trade");
      const survivor1Inventory = await this.getSurvivorInventory(survivor1Id);
      const survivor2Inventory = await this.getSurvivorInventory(survivor2Id);

      await this.verifyIfTradeisEqual([survivor1Offers, survivor2Offers]);

      let promises = survivor1Offers.map((offer) => {
        const survivorResource = survivor1Inventory.find((sR) => sR.resourceId === offer.id);
        survivorResource.quantity -= offer.quantity;
        return survivorResource.save({ transaction: t });
      });
      await Promise.all(promises);
      promises = survivor1Offers.map((offer) => {
        const survivorResource = survivor2Inventory.find((sR) => sR.resourceId === offer.id);
        survivorResource.quantity += offer.quantity;
        return survivorResource.save({ transaction: t });
      });
      await Promise.all(promises);

      promises = survivor2Offers.map((offer) => {
        const survivorResource = survivor2Inventory.find((sR) => sR.resourceId === offer.id);
        survivorResource.quantity -= offer.quantity;
        return survivorResource.save({ transaction: t });
      });
      await Promise.all(promises);

      promises = survivor2Offers.map((offer) => {
        const survivorResource = survivor1Inventory.find((sR) => sR.resourceId === offer.id);
        survivorResource.quantity += offer.quantity;
        return survivorResource.save({ transaction: t });
      });
      await Promise.all(promises);
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async getSurvivorInventory(id) {
    return SurvivorResource.findAll({ where: { survivorId: id } });
  }

  async verifyIfTradeisEqual(offers) {
    const resources = await Resource.findAll();
    const pointsTable = {};
    resources.forEach((resource) => {
      pointsTable[resource.id] = resource.points;
    });
    const sums = [0, 0];
    offers[0].forEach((off) => { sums[0] += pointsTable[off.id] * off.quantity; });
    offers[1].forEach((off) => { sums[1] += pointsTable[off.id] * off.quantity; });

    if (sums[0] !== sums[1]) throw new TradeNotEqualError('Trade is not equal');
  }
}

module.exports = new SurvivorsController();
