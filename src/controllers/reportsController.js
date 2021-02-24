/* eslint-disable no-param-reassign */
const Resource = require('../models/Resource');
const Survivor = require('../models/Survivor');
const SurvivorResource = require('../models/SurvivorResource');

class ReportsController {
  async getSurvivorsInfo() {
    const nonInfecteds = await Survivor.findAll({ where: { isInfected: false } });
    const infecteds = await Survivor.findAll({ where: { isInfected: true } });

    const total = nonInfecteds.length + infecteds.length;
    const nonInfectedsRatio = nonInfecteds.length ? `${(nonInfecteds.length / total) * 100}%` : '0%';
    const infectedsRatio = infecteds.length ? `${(infecteds.length / total) * 100}%` : '0%';
    const survivors = {
      total,
      'non-infecteds': nonInfectedsRatio,
      infecteds: infectedsRatio,
    };
    return survivors;
  }

  async getResourcesInfo() {
    const survivorsResources = await SurvivorResource.findAll();
    const resources = await Resource.findAll({ attributes: ['id', 'name', 'points'] });
    const resourceCounter = {};
    resources.forEach((resource) => {
      resourceCounter[resource.id] = { name: resource.name, points: resource.points, counter: [] };
    });
    survivorsResources.forEach((sR) => {
      (resourceCounter[sR.resourceId].counter).push(sR.quantity);
    });

    const resourceCounterEntries = Object.entries(resourceCounter);
    return resourceCounterEntries.map((entry) => ({
      id: entry[0],
      name: entry[1].name,
      points: entry[1].points,
      'average-per-survivor': entry[1].counter.reduce((a, b) => a + b, 0) / entry[1].counter.length,
    }));
  }

  async getPointsInfo() {
    let pointsCounter = 0;
    let lostPointsCounter = 0;
    const survivorsResources = await SurvivorResource.findAll({
      include: [{ model: Survivor }, { model: Resource }],
    });

    survivorsResources.forEach((sR) => {
      pointsCounter += sR.resource.points * sR.quantity;
      if (sR.survivor.isInfected) {
        lostPointsCounter += sR.resource.points * sR.quantity;
      }
    });

    return {
      total: pointsCounter,
      'lost-to-infected': lostPointsCounter,
    };
  }
}

module.exports = new ReportsController();
