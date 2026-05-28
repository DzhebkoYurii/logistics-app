const { Client } = require('../models');

module.exports = {
  findAll: async () => await Client.findAll(),

  findById: async (id) => await Client.findByPk(id),

  create: async (data) => await Client.create(data),

  update: async (id, data) => {
    await Client.update(data, { where: { id } });
    return await Client.findByPk(id);
  },

  remove: async (id) => {
    const deletedCount = await Client.destroy({ where: { id } });
    return deletedCount > 0;
  },

  exists: async (id) => {
    const count = await Client.count({ where: { id } });
    return count > 0;
  },
};