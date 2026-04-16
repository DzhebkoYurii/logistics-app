const Status = require('../models/Status');

let statuses = [];
let nextId = 1;

module.exports = {
  findAll: () => [...statuses],

  findById: (id) => statuses.find(s => s.id === Number(id)) || null,

  findByShipmentId: (shipmentId) =>
    statuses
      .filter(s => s.shipmentId === Number(shipmentId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),

  findLatestByShipmentId: (shipmentId) => {
    const all = statuses.filter(s => s.shipmentId === Number(shipmentId));
    if (!all.length) return null;
    return all.reduce((latest, s) =>
      new Date(s.createdAt) > new Date(latest.createdAt) ? s : latest
    );
  },

  create: (data) => {
    const status = new Status({ id: nextId++, ...data });
    statuses.push(status);
    return status;
  },

};