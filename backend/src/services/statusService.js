const repo = require('../repositories/statusRepository');
const shipmentRepo = require('../repositories/shipmentRepository');
const Status = require('../models/Status');

module.exports = {
  getAll: () => repo.findAll(),

  getByShipmentId: (shipmentId) => {
    if (!shipmentRepo.exists(shipmentId)) {
      throw { status: 404, message: `Shipment with id=${shipmentId} not found` };
    }
    return repo.findByShipmentId(shipmentId);
  },

  getLatestForShipment: (shipmentId) => {
    if (!shipmentRepo.exists(shipmentId)) {
      throw { status: 404, message: `Shipment with id=${shipmentId} not found` };
    }
    return repo.findLatestByShipmentId(shipmentId);
  },

  create: (data) => {
    if (!shipmentRepo.exists(data.shipmentId)) {
      throw { status: 400, message: `Shipment with id=${data.shipmentId} does not exist` };
    }

    // після DELIVERED або CANCELLED нові статуси не додаються
    const latest = repo.findLatestByShipmentId(data.shipmentId);
    if (latest && ['DELIVERED', 'CANCELLED'].includes(latest.code)) {
      throw {
        status: 409,
        message: `Cannot add status to a shipment that is already "${latest.code}"`,
      };
    }

    // валідація переходу статусів 
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

    return repo.create(data);
  },
};