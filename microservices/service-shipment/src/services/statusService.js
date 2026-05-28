const repo = require('../repositories/statusRepository');
const shipmentRepo = require('../repositories/shipmentRepository');
// Модель Status більше не імпортуємо напряму, валідацію статусів винесемо сюди
const VALID_CODES = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];

module.exports = {
  getAll: async () => await repo.findAll(),

  getByShipmentId: async (shipmentId) => {
    if (!(await shipmentRepo.exists(shipmentId))) {
      throw { status: 404, message: `Shipment with id=${shipmentId} not found` };
    }
    return await repo.findByShipmentId(shipmentId);
  },

  getLatestForShipment: async (shipmentId) => {
    if (!(await shipmentRepo.exists(shipmentId))) {
      throw { status: 404, message: `Shipment with id=${shipmentId} not found` };
    }
    return await repo.findLatestByShipmentId(shipmentId);
  },

  create: async (data) => {
    if (!(await shipmentRepo.exists(data.shipmentId))) {
      throw { status: 400, message: `Shipment with id=${data.shipmentId} does not exist` };
    }

    const latest = await repo.findLatestByShipmentId(data.shipmentId);
    if (latest && ['DELIVERED', 'CANCELLED'].includes(latest.code)) {
      throw {
        status: 409,
        message: `Cannot add status to a shipment that is already "${latest.code}"`,
      };
    }

    const validTransitions = {
      PENDING:    ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['IN_TRANSIT', 'CANCELLED'],
      IN_TRANSIT: ['DELIVERED', 'RETURNED', 'CANCELLED'],
      DELIVERED:  [],
      CANCELLED:  [],
      RETURNED:   ['PROCESSING'],
    };

    if (latest && !validTransitions[latest.code].includes(data.code)) {
      throw {
        status: 409,
        message: `Invalid transition: ${latest.code} → ${data.code}. ` +
                 `Allowed: ${validTransitions[latest.code].join(', ') || 'none'}`,
      };
    }

    return await repo.create(data);
  },
};