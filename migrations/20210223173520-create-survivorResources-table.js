module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('survivorResources', {
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
      resourceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'resources',
          key: 'id',
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('survivorResources');
  },
};
