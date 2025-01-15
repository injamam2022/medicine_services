'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const modules = require('./module');
const role = require('./role');

const access = sequelize.define(
  'access',
  {
    accessId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "role",
        key: "roleId"
       }
    },
    moduleId: {
      type: DataTypes.INTEGER,
        references: {
          model: 'module',
          key: 'moduleId',
      },
    },
    addFlag: {
      type: DataTypes.BOOLEAN
    },
    editFlag: {
      type: DataTypes.BOOLEAN
    },
    viewFlag: {
      type: DataTypes.BOOLEAN
    },
    deleteFlag: {
      type: DataTypes.BOOLEAN
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
      modelName: 'access',
  },
  {
    indexes: [
        {
            unique: true,
            fields: ['roleId', 'moduleId']
        }
    ]
  }
);

modules.hasMany(access, { 
  foreignKey: 'moduleId' 
});
access.belongsTo(modules, {
    foreignKey: 'moduleId',
});

role.hasMany(access, 
  { foreignKey: 'roleId' 

  });
access.belongsTo(role, {
  foreignKey: 'roleId',
});

module.exports = access;
