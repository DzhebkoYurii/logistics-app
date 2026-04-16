const Route = require('../models/Route');

let routes = [];
let nextId = 1;

module.exports = {
  findAll: () => [...routes],

  findById: (id) => routes.find(r => r.id === Number(id)) || null,

  findByTransportId: (transportId) =>
    routes.filter(r => r.transportId === Number(transportId)),

  create: (data) => {
    const route = new Route({ id: nextId++, ...data });
    routes.push(route);
    return route;
  },

  update: (id, data) => {
    const idx = routes.findIndex(r => r.id === Number(id));
    if (idx === -1) return null;
    routes[idx] = { ...routes[idx], ...data, id: Number(id) };
    return routes[idx];
  },

  remove: (id) => {
    const idx = routes.findIndex(r => r.id === Number(id));
    if (idx === -1) return false;
    routes.splice(idx, 1);
    return true;
  },

  exists: (id) => routes.some(r => r.id === Number(id)),
};