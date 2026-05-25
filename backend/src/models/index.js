const sequelize = require('../config/database');

const Client = require('./Client');
const Route = require('./Route');
const Shipment = require('./Shipment');
const Status = require('./Status');
const Transport = require('./Transport');
const Warehouse = require('./Warehouse');

// 1. Client <-> Shipment (1 до багатьох)
Client.hasMany(Shipment, { foreignKey: 'clientId', onDelete: 'RESTRICT' });
Shipment.belongsTo(Client, { foreignKey: 'clientId' });

// 2. Warehouse <-> Shipment (1 до багатьох)
Warehouse.hasMany(Shipment, { foreignKey: 'warehouseId', onDelete: 'RESTRICT' });
Shipment.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

// 3. Route <-> Shipment (1 до багатьох)
Route.hasMany(Shipment, { foreignKey: 'routeId', onDelete: 'RESTRICT' });
Shipment.belongsTo(Route, { foreignKey: 'routeId' });

// 4. Transport <-> Route (1 до багатьох)
Transport.hasMany(Route, { foreignKey: 'transportId', onDelete: 'RESTRICT' });
Route.belongsTo(Transport, { foreignKey: 'transportId' });

// 5. Shipment <-> Status (1 до багатьох)
Shipment.hasMany(Status, { foreignKey: 'shipmentId', onDelete: 'CASCADE' });
Status.belongsTo(Shipment, { foreignKey: 'shipmentId' });


module.exports = {
  sequelize,
  Client,
  Route,
  Shipment,
  Status,
  Transport,
  Warehouse
};