/* eslint-disable no-param-reassign */
const Survivor = require('../models/Survivor');

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
}

module.exports = new ReportsController();
