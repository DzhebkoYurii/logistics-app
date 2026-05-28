// Можливі коди:
//   PENDING     — щойно створено, ще не обробляється
//   PROCESSING  — прийнято на склад, готується до відправки
//   IN_TRANSIT  — в дорозі
//   DELIVERED   — доставлено одержувачу
//   CANCELLED   — скасовано
//   RETURNED    — повернено відправнику
 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VALID_CODES = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const Status = sequelize.define('Status', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { 
    type: DataTypes.ENUM(...VALID_CODES), 
    allowNull: false 
  },
  note: { type: DataTypes.STRING, allowNull: true }
});

Status.VALID_CODES = VALID_CODES; 

module.exports = Status;