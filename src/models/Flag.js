const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Flag extends Sequelize.Model {}

Flag.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  survivorId: {
    type: Sequelize.INTEGER,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  sequelize,
  modelName: 'flag',
});

module.exports = Flag;
