module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('survivors',
      'isInfected',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('survivors', 'isInfected');
  },
};
