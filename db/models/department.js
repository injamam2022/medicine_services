'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const department = sequelize.define(
    'department',
    {
      departmentId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        departmentName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'departmentName cannot be null',
                },
                notEmpty: {
                    msg: 'departmentName cannot be empty',
                },
            },
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
      },
      updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
      },
      deletedAt: {
          type: DataTypes.DATE,
      },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'department',
    }
    
);

module.exports = department;
