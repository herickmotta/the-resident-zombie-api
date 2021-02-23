module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lastLocations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      survivorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'survivors',
          key: 'id',
        },
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('lastLocations');
  },
};
