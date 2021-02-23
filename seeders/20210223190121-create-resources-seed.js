module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('resources', [
      {
        name: 'Fiji Water',
        points: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Campbell Soup',
        points: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'First Aid Pouch',
        points: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'AK47',
        points: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => queryInterface.bulkDelete('resources', null, {}),
};
