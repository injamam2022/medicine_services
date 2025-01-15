'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('changeLog', {
        changeLogId: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          moduleId: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          changes: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('changeLog');
  }
};