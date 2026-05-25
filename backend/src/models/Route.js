const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  origin: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  distanceKm: { type: DataTypes.FLOAT, allowNull: false },
  estimatedHours: { type: DataTypes.FLOAT, allowNull: false },
  waypoints: { 
    type: DataTypes.ARRAY(DataTypes.STRING), 
    defaultValue: [] 
  }
});

module.exports = Route;