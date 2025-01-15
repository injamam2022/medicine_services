'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const facility = sequelize.define(
    'facility',
    {
      facilityId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      planType: {
        type: DataTypes.STRING
      },
      locationType: {
        type: DataTypes.STRING
      },
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locationName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
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
        modelName: 'facility',
    }
    
);

module.exports = facility;
