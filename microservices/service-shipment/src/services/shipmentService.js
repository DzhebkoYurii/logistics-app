const repo = require('../repositories/shipmentRepository');
const clientRepo = require('../repositories/clientRepository');
const statusRepo = require('../repositories/statusRepository');
const axios = require('axios'); 

module.exports = {
  getAll: async () => {
    const shipments = await repo.findAll();
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
    // Перевірка у власній БД
    if (!(await clientRepo.exists(data.clientId))) {
      throw { status: 400, message: `Client with id=${data.clientId} does not exist` };
    }

    // Міжсервісний виклик до Service Warehouse (порт 8082)
    if (data.warehouseId) {
      try {
        const warehouseUrl = process.env.WAREHOUSE_SERVICE_URL || 'http://localhost:8082';
        const response = await axios.get(`${warehouseUrl}/api/warehouses/${data.warehouseId}`);
        const warehouse = response.data;
        if (warehouse.currentLoad >= warehouse.capacity) {
          throw { status: 409, message: `Warehouse id=${data.warehouseId} is at full capacity` };
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw { status: 400, message: `Warehouse with id=${data.warehouseId} does not exist` };
        }
        // Якщо сервіс складів лежить (вимкнений або впав)
        throw { status: 503, message: 'Warehouse service is currently unavailable' };
      }
    }

    // Міжсервісний виклик до Service Routing (порт 8083)
    if (data.routeId) {
      try {
        const routingUrl = process.env.ROUTING_SERVICE_URL || 'http://localhost:8083';
        await axios.get(`${routingUrl}/api/routes/${data.routeId}`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw { status: 400, message: `Route with id=${data.routeId} does not exist` };
        }
        throw { status: 503, message: 'Routing service is currently unavailable' };
      }
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

  transferShipment: async (shipmentId, fromWarehouseId, toWarehouseId) => {
    // Перевіряємо, чи існує посилка у БД
    const shipment = await repo.findById(shipmentId);
    if (!shipment) throw { status: 404, message: `Shipment with id=${shipmentId} not found` };

    // HTTP-запит до Сервісу Складів, щоб він змінив місткість
    const warehouseUrl = process.env.WAREHOUSE_SERVICE_URL || 'http://localhost:8082';
    try {
      await axios.post(`${warehouseUrl}/api/warehouses/transfer-capacity`, {
        fromWarehouseId,
        toWarehouseId
      });
    } catch (error) {
      if (error.response) {
        throw { status: error.response.status, message: error.response.data.message };
      }
      throw { status: 503, message: 'Warehouse service is currently unavailable' };
    }

    // змінюємо склад у самій посилці
    await repo.update(shipmentId, { warehouseId: Number(toWarehouseId) });

    // Логуємо в історію статусів
    await statusRepo.create({ 
      shipmentId, 
      code: 'PROCESSING', 
      note: `Transferred from warehouse ${fromWarehouseId} to ${toWarehouseId}` 
    });

    return {
      shipmentId: Number(shipmentId),
      movedFrom: fromWarehouseId,
      movedTo: toWarehouseId,
      status: 'Transfer complete'
    };
  }
};