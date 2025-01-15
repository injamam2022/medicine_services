'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const modules = sequelize.define(
    'module',
    {
      moduleId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      moduleName: {
        type: DataTypes.STRING
      },
      label: {
        allowNull: false,
        type: DataTypes.STRING
      },
      icon: {
        allowNull: false,
        type: DataTypes.STRING
      },
      route:{
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'module',
    }
    
);

module.exports = modules;
