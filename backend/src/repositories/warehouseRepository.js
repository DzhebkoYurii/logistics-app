const { Warehouse } = require('../models');

module.exports = {
  findAll: async () => await Warehouse.findAll(),

  findById: async (id) => await Warehouse.findByPk(id),

  create: async (data) => await Warehouse.create(data),

  update: async (id, data, options = {}) => {
    await Warehouse.update(data, { where: { id }, ...options });
    return await Warehouse.findByPk(id, options);
  },

  remove: async (id) => {
    const deletedCount = await Warehouse.destroy({ where: { id } });
    return deletedCount > 0;
  },

  exists: async (id) => {
    const count = await Warehouse.count({ where: { id } });
    return count > 0;
  },
};