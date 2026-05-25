const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trackingNumber: { type: DataTypes.STRING, unique: true },
  weight: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true }
});

// Автоматична генерація трек-номера
Shipment.beforeCreate((shipment) => {
  if (!shipment.trackingNumber) {
    shipment.trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
});

module.exports = Shipment;