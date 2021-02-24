/* eslint-disable no-param-reassign */
const NotFoundError = require('../errors/NotFoundError');
const LastLocation = require('../models/LastLocation');
const Resource = require('../models/Resource');
const Survivor = require('../models/Survivor');
const SurvivorResource = require('../models/SurvivorResource');

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
        return { id: validId, quantity: resource.id };
      }
      return { id: validId, quantity: 0 };
    });
  }

  async getSurvivorByPk(id) {
    const survivor = await Survivor.findByPk(id, {
      attributes: ['id', 'name', 'gender'],
      include: [
        {
          model: Resource,
          attributes: ['id', 'name', 'points'],
          through: { attributes: ['quantity'] },
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
}

module.exports = new SurvivorsController();
