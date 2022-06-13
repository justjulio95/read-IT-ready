const {Model, DataTypes} =require('sequelize');
const { underscoredIf } = require('sequelize/types/utils');
const sequelize = require('../config/connection')

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
  sequelize,
  freezeTableName: true,
  underscored: true,
  modelName: 'post'
  }
)