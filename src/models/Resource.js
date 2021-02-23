const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Resource extends Sequelize.Model {}

Resource.init({
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
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  sequelize,
  modelName: 'resource',
});

module.exports = Resource;
