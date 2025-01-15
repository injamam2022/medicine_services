'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('access', {
      accessId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
      },
      moduleId: {
        type: Sequelize.INTEGER,
      },
      addFlag: {
        type: Sequelize.BOOLEAN
      },
      editFlag: {
        type: Sequelize.BOOLEAN
      },
      viewFlag: {
        type: Sequelize.BOOLEAN
      },
      deleteFlag: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('access');
  }
};