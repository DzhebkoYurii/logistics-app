const { Route } = require('../models');

module.exports = {
  findAll: async () => await Route.findAll(),

  findById: async (id) => await Route.findByPk(id),

  findByTransportId: async (transportId) => 
    await Route.findAll({ where: { transportId } }),

  create: async (data) => await Route.create(data),

  update: async (id, data) => {
    await Route.update(data, { where: { id } });
    return await Route.findByPk(id);
  },

  remove: async (id) => {
    const deletedCount = await Route.destroy({ where: { id } });
    return deletedCount > 0;
  },

  exists: async (id) => {
    const count = await Route.count({ where: { id } });
    return count > 0;
  },
};