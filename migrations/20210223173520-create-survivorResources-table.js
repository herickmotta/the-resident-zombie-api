module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('survivorResources', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      suvivorId: {
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
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('survivorResources');
  },
};
