module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flags', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      survivorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'survivors',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('flags');
  },
};
