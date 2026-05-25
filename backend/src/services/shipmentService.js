const repo = require('../repositories/shipmentRepository');
const clientRepo = require('../repositories/clientRepository');
const warehouseRepo = require('../repositories/warehouseRepository');
const routeRepo = require('../repositories/routeRepository');
const statusRepo = require('../repositories/statusRepository');

module.exports = {
  getAll: async () => {
    const shipments = await repo.findAll();
    // Використовуємо Promise.all для асинхронного map
    return await Promise.all(shipments.map(async s => {
      const plainS = s.get ? s.get({ plain: true }) : s;
      return {
        ...plainS,
        currentStatus: await statusRepo.findLatestByShipmentId(plainS.id),
      };
    }));
  },

  getById: async (id) => {
    const shipment = await repo.findById(id);
    if (!shipment) throw { status: 404, message: `Shipment with id=${id} not found` };
    const plainS = shipment.get ? shipment.get({ plain: true }) : shipment;
    
    return {
      ...plainS,
      currentStatus: await statusRepo.findLatestByShipmentId(id),
      statusHistory: await statusRepo.findByShipmentId(id),
    };
  },

  trackByNumber: async (trackingNumber) => {
    const shipment = await repo.findByTrackingNumber(trackingNumber);
    if (!shipment) {
      throw { status: 404, message: `Tracking number "${trackingNumber}" not found` };
    }
    const plainS = shipment.get ? shipment.get({ plain: true }) : shipment;

    return {
      ...plainS,
      currentStatus: await statusRepo.findLatestByShipmentId(plainS.id),
      statusHistory: await statusRepo.findByShipmentId(plainS.id),
    };
  },

  create: async (data) => {
    if (!(await clientRepo.exists(data.clientId))) {
      throw { status: 400, message: `Client with id=${data.clientId} does not exist` };
    }

    if (data.warehouseId) {
      const warehouse = await warehouseRepo.findById(data.warehouseId);
      if (!warehouse) {
        throw { status: 400, message: `Warehouse with id=${data.warehouseId} does not exist` };
      }
      if (warehouse.currentLoad >= warehouse.capacity) {
        throw { status: 409, message: `Warehouse id=${data.warehouseId} is at full capacity` };
      }
    }

    if (data.routeId && !(await routeRepo.exists(data.routeId))) {
      throw { status: 400, message: `Route with id=${data.routeId} does not exist` };
    }

    const shipment = await repo.create(data);
    const plainS = shipment.get ? shipment.get({ plain: true }) : shipment;

    await statusRepo.create({ shipmentId: plainS.id, code: 'PENDING', note: 'Shipment created' });

    return { ...plainS, currentStatus: await statusRepo.findLatestByShipmentId(plainS.id) };
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Shipment with id=${id} not found` };
    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Shipment with id=${id} not found` };
    await repo.remove(id);
  },
};