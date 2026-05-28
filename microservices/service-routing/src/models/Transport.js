const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transport = sequelize.define('Transport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  licensePlate: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.FLOAT, allowNull: false },
  driverName: { type: DataTypes.STRING, allowNull: true },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Transport;