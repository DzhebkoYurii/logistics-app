const Transport = require('../models/Transport');

let transports = [];
let nextId = 1;

module.exports = {
  findAll: () => [...transports],

  findById: (id) => transports.find(t => t.id === Number(id)) || null,

  findAvailable: () => transports.filter(t => t.isAvailable),

  create: (data) => {
    const transport = new Transport({ id: nextId++, ...data });
    transports.push(transport);
    return transport;
  },

  update: (id, data) => {
    const idx = transports.findIndex(t => t.id === Number(id));
    if (idx === -1) return null;
    transports[idx] = { ...transports[idx], ...data, id: Number(id) };
    return transports[idx];
  },

  remove: (id) => {
    const idx = transports.findIndex(t => t.id === Number(id));
    if (idx === -1) return false;
    transports.splice(idx, 1);
    return true;
  },

  exists: (id) => transports.some(t => t.id === Number(id)),
};