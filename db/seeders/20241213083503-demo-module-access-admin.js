'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('access', [
      {
          roleId: 1,
          moduleId: 1,
          addFlag: true,
          editFlag: true,
          deleteFlag: true,
          viewFlag: true,
          createdAt: new Date(),
          updatedAt: new Date(),
      },
      {
        roleId: 1,
        moduleId: 2,
        addFlag: true,
        editFlag: true,
        deleteFlag: true,
        viewFlag: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 1,
        moduleId: 3,
        addFlag: true,
        editFlag: true,
        deleteFlag: true,
        viewFlag: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 1,
        moduleId: 4,
        addFlag: true,
        editFlag: true,
        deleteFlag: true,
        viewFlag: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 1,
        moduleId: 5,
        addFlag: true,
        editFlag: true,
        deleteFlag: true,
        viewFlag: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('access');
  }
};
