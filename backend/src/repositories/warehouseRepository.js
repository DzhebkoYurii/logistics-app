const Warehouse = require('../models/Warehouse');
 
let warehouses = [];
let nextId = 1;
 
module.exports = {
  findAll: () => [...warehouses],
 
  findById: (id) => warehouses.find(w => w.id === Number(id)) || null,
 
  create: (data) => {
    const warehouse = new Warehouse({ id: nextId++, ...data });
    warehouses.push(warehouse);
    return warehouse;
  },
 
  update: (id, data) => {
    const idx = warehouses.findIndex(w => w.id === Number(id));
    if (idx === -1) return null;
    warehouses[idx] = { ...warehouses[idx], ...data, id: Number(id) };
    return warehouses[idx];
  },
 
  remove: (id) => {
    const idx = warehouses.findIndex(w => w.id === Number(id));
    if (idx === -1) return false;
    warehouses.splice(idx, 1);
    return true;
  },
 
  exists: (id) => warehouses.some(w => w.id === Number(id)),
};