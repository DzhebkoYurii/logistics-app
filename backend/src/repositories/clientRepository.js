const Client = require('../models/Client');

let clients = [];
let nextId = 1;

module.exports = {
  findAll: () => [...clients],

  findById: (id) => clients.find(c => c.id === Number(id)) || null,

  create: (data) => {
    const client = new Client({ id: nextId++, ...data });
    clients.push(client);
    return client;
  },

  update: (id, data) => {
    const idx = clients.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    clients[idx] = { ...clients[idx], ...data, id: Number(id) };
    return clients[idx];
  },

  remove: (id) => {
    const idx = clients.findIndex(c => c.id === Number(id));
    if (idx === -1) return false;
    clients.splice(idx, 1);
    return true;
  },

  exists: (id) => clients.some(c => c.id === Number(id)),
};