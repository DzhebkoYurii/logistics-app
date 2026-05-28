const { Status } = require('../models');

module.exports = {
  findAll: async () => await Status.findAll(),

  findById: async (id) => await Status.findByPk(id),

  findByShipmentId: async (shipmentId) => 
    await Status.findAll({
      where: { shipmentId },
      order: [['createdAt', 'ASC']] // База даних сама відсортує від найстарішого
    }),

  findLatestByShipmentId: async (shipmentId) => 
    await Status.findOne({
      where: { shipmentId },
      order: [['createdAt', 'DESC']] // Беремо найновіший запис
    }),

  create: async (data) => await Status.create(data),
};