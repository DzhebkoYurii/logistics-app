const Shipment = require('../models/Shipment');
 
let shipments = [];
let nextId = 1;
 
module.exports = {
  findAll: () => [...shipments],
 
  findById: (id) => shipments.find(s => s.id === Number(id)) || null,
 
  findByTrackingNumber: (trackingNumber) =>
    shipments.find(s => s.trackingNumber === trackingNumber) || null,
 
  findByClientId: (clientId) =>
    shipments.filter(s => s.clientId === Number(clientId)),
 
  findByWarehouseId: (warehouseId) =>
    shipments.filter(s => s.warehouseId === Number(warehouseId)),
 
  create: (data) => {
    const shipment = new Shipment({ id: nextId++, ...data });
    shipments.push(shipment);
    return shipment;
  },
 
  update: (id, data) => {
    const idx = shipments.findIndex(s => s.id === Number(id));
    if (idx === -1) return null;
    shipments[idx] = { ...shipments[idx], ...data, id: Number(id) };
    return shipments[idx];
  },
 
  remove: (id) => {
    const idx = shipments.findIndex(s => s.id === Number(id));
    if (idx === -1) return false;
    shipments.splice(idx, 1);
    return true;
  },
 
  exists: (id) => shipments.some(s => s.id === Number(id)),
};