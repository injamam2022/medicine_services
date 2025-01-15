"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("module", [
      {
        moduleName: "Manage Department",
        label: "Manage Department",
        icon: "pi pi-link",
        route: "/department",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        moduleName: "Manage Role",
        label: "Manage Role",
        icon: "pi pi-link",
        route: "/role",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        moduleName: "Manage User",
        label: "Manage User",
        icon: "pi pi-link",
        route: "/user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        moduleName: "Manage Access",
        label: "Manage Access",
        icon: "pi pi-link",
        route: "/manage-access",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        moduleName: "Manage Facility",
        label: "Manage Facility",
        icon: "pi pi-link",
        route: "/facility",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("module");
  },
};
