const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class SurvivorResource extends Sequelize.Model {}

SurvivorResource.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  survivorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  resourceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,

}, {
  sequelize,
  modelName: 'survivorResource',
});

module.exports = SurvivorResource;
