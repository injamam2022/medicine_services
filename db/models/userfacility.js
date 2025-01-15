'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const facility = require('./facility');

const userFacility = sequelize.define(
    'user_facility',
    {
        userFacilityId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        facilityId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
        modelName:'userFacility'
    } 
);

facility.hasMany(userFacility, { 
    foreignKey: {
        name: 'facilityId',
      },
    
});

userFacility.belongsTo(facility, {
    foreignKey: {
        name: 'facilityId',
      },
});

module.exports = userFacility;
