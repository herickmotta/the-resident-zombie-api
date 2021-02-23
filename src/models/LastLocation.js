const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class LastLocation extends Sequelize.Model {}

LastLocation.init({
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
  latitude: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  longitude: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,

}, {
  sequelize,
  modelName: 'lastLocation',
});

module.exports = LastLocation;
