const { Shipment } = require('../models');

module.exports = {
  findAll: async () => await Shipment.findAll(),

  findById: async (id) => await Shipment.findByPk(id),

  findByTrackingNumber: async (trackingNumber) => 
    await Shipment.findOne({ where: { trackingNumber } }),

  findByClientId: async (clientId) => 
    await Shipment.findAll({ where: { clientId } }),

  findByWarehouseId: async (warehouseId) => 
    await Shipment.findAll({ where: { warehouseId } }),

  create: async (data) => await Shipment.create(data),

  update: async (id, data) => {
    await Shipment.update(data, { where: { id } });
    return await Shipment.findByPk(id);
  },

  remove: async (id) => {
    const deletedCount = await Shipment.destroy({ where: { id } });
    return deletedCount > 0;
  },

  exists: async (id) => {
    const count = await Shipment.count({ where: { id } });
    return count > 0;
  },
};