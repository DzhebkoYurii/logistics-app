const { Transport } = require('../models');

module.exports = {
  findAll: async () => await Transport.findAll(),

  findById: async (id) => await Transport.findByPk(id),

  findAvailable: async () => 
    await Transport.findAll({ where: { isAvailable: true } }),

  create: async (data) => await Transport.create(data),

  update: async (id, data) => {
    await Transport.update(data, { where: { id } });
    return await Transport.findByPk(id);
  },

  remove: async (id) => {
    const deletedCount = await Transport.destroy({ where: { id } });
    return deletedCount > 0;
  },

  exists: async (id) => {
    const count = await Transport.count({ where: { id } });
    return count > 0;
  },
};