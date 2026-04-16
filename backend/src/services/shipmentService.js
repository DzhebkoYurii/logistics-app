const repo = require('../repositories/shipmentRepository');
const clientRepo = require('../repositories/clientRepository');
const warehouseRepo = require('../repositories/warehouseRepository');
const routeRepo = require('../repositories/routeRepository');
const statusRepo = require('../repositories/statusRepository');

module.exports = {
  getAll: () => {
    return repo.findAll().map(s => ({
      ...s,
      currentStatus: statusRepo.findLatestByShipmentId(s.id),
    }));
  },

  getById: (id) => {
    const shipment = repo.findById(id);
    if (!shipment) throw { status: 404, message: `Shipment with id=${id} not found` };
    return {
      ...shipment,
      currentStatus: statusRepo.findLatestByShipmentId(id),
      statusHistory: statusRepo.findByShipmentId(id),
    };
  },

  trackByNumber: (trackingNumber) => {
    const shipment = repo.findByTrackingNumber(trackingNumber);
    if (!shipment) {
      throw { status: 404, message: `Tracking number "${trackingNumber}" not found` };
    }
    return {
      ...shipment,
      currentStatus: statusRepo.findLatestByShipmentId(shipment.id),
      statusHistory: statusRepo.findByShipmentId(shipment.id),
    };
  },

  create: (data) => {
    if (!clientRepo.exists(data.clientId)) {
      throw { status: 400, message: `Client with id=${data.clientId} does not exist` };
    }

    if (data.warehouseId) {
      const warehouse = warehouseRepo.findById(data.warehouseId);
      if (!warehouse) {
        throw { status: 400, message: `Warehouse with id=${data.warehouseId} does not exist` };
      }
      if (warehouse.currentLoad >= warehouse.capacity) {
        throw { status: 409, message: `Warehouse id=${data.warehouseId} is at full capacity` };
      }
    }

    if (data.routeId && !routeRepo.exists(data.routeId)) {
      throw { status: 400, message: `Route with id=${data.routeId} does not exist` };
    }

    const shipment = repo.create(data);

    statusRepo.create({ shipmentId: shipment.id, code: 'PENDING', note: 'Shipment created' });

    return { ...shipment, currentStatus: statusRepo.findLatestByShipmentId(shipment.id) };
  },

  update: (id, data) => {
    if (!repo.exists(id)) throw { status: 404, message: `Shipment with id=${id} not found` };
    return repo.update(id, data);
  },

  remove: (id) => {
    if (!repo.exists(id)) throw { status: 404, message: `Shipment with id=${id} not found` };
    repo.remove(id);
  },
};