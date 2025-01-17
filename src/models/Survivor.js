const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Survivor extends Sequelize.Model {}

Survivor.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isInfected: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,

}, {
  sequelize,
  modelName: 'survivor',
});

module.exports = Survivor;
