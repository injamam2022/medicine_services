'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const countries = sequelize.define(
    'countries',
    {
        roleId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        departmentId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'roleName cannot be null',
                },
                notEmpty: {
                    msg: 'roleName cannot be empty',
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
        modelName: 'countries',
    }
    
);

module.exports = countries;
