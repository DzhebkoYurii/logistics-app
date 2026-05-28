const repo = require('../repositories/warehouseRepository');
const sequelize = require('../config/database');

module.exports = {
  getAll: async () => {
    const warehouses = await repo.findAll();
    return warehouses.map(w => {
      const plainW = w.get ? w.get({ plain: true }) : w;
      return {
        ...plainW,
        availableCapacity: plainW.capacity - plainW.currentLoad,  
      };
    });
  },

  getById: async (id) => {
    const warehouse = await repo.findById(id);
    if (!warehouse) throw { status: 404, message: `Warehouse with id=${id} not found` };
    const plainW = warehouse.get ? warehouse.get({ plain: true }) : warehouse;
    return { ...plainW, availableCapacity: plainW.capacity - plainW.currentLoad };
  },

  create: async (data) => {
    if (data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return await repo.create(data);
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Warehouse with id=${id} not found` };
    if (data.currentLoad !== undefined && data.capacity !== undefined &&
        data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Warehouse with id=${id} not found` };

    await repo.remove(id);
  },

};