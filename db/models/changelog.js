'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const user = require('./user');

const changeLog = sequelize.define(
  'changeLog',
  {
    changeLogId: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
      },
      moduleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSON,
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
      modelName: 'changeLog',
  }
  
);

user.hasMany(changeLog, { 
  foreignKey: {
      name: 'userId',
    }
});

changeLog.belongsTo(user, {
  foreignKey: {
      name: 'userId',
    }
});


module.exports = changeLog;
