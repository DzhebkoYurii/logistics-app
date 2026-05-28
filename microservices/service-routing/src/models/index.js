const sequelize = require('../config/database');
const Transport = require('./Transport');
const Route = require('./Route');

// Один Транспорт може мати багато Маршрутів
Transport.hasMany(Route, { foreignKey: 'transportId' });
Route.belongsTo(Transport, { foreignKey: 'transportId' });

module.exports = {
  sequelize,
  Transport,
  Route
};