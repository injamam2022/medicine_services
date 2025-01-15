'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role', [
      {
          roleName: 'Admin',
          departmentId:1,
          createdAt: new Date(),
          updatedAt: new Date(),
      },
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role');
  }
};
