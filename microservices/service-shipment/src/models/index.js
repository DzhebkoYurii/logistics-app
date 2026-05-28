const sequelize = require('../config/database');
const Client = require('./Client');
const Shipment = require('./Shipment');
const Status = require('./Status');

Client.hasMany(Shipment, { foreignKey: 'clientId' });
Shipment.belongsTo(Client, { foreignKey: 'clientId' });

Shipment.hasMany(Status, { foreignKey: 'shipmentId' });
Status.belongsTo(Shipment, { foreignKey: 'shipmentId' });

module.exports = { sequelize, Client, Shipment, Status };