const repo = require('../repositories/warehouseRepository');
const shipmentRepo = require('../repositories/shipmentRepository');

module.exports = {
  getAll: async () => {
    const warehouses = await repo.findAll();
    return warehouses.map(w => {
      const plainW = w.get ? w.get({ plain: true }) : w;
      return {
        ...plainW,
        availableCapacity: plainW.capacity - plainW.currentLoad,  
      };
    });
  },

  getById: async (id) => {
    const warehouse = await repo.findById(id);
    if (!warehouse) throw { status: 404, message: `Warehouse with id=${id} not found` };
    const plainW = warehouse.get ? warehouse.get({ plain: true }) : warehouse;
    return { ...plainW, availableCapacity: plainW.capacity - plainW.currentLoad };
  },

  create: async (data) => {
    if (data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return await repo.create(data);
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Warehouse with id=${id} not found` };
    if (data.currentLoad !== undefined && data.capacity !== undefined &&
        data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Warehouse with id=${id} not found` };

    const shipments = await shipmentRepo.findByWarehouseId(id);
    if (shipments.length > 0) {
      throw { status: 409, message: `Cannot delete warehouse id=${id}: has active shipments` };
    }

    await repo.remove(id);
  },

  transferShipment: async (shipmentId, fromWarehouseId, toWarehouseId) => {
    const from = await repo.findById(fromWarehouseId);
    const to = await repo.findById(toWarehouseId);

    if (!from) throw { status: 404, message: `Source warehouse id=${fromWarehouseId} not found` };
    if (!to) throw { status: 404, message: `Target warehouse id=${toWarehouseId} not found` };
    if (to.currentLoad >= to.capacity) {
      throw { status: 409, message: `Target warehouse id=${toWarehouseId} is at full capacity` };
    }

    await repo.update(fromWarehouseId, { currentLoad: Math.max(0, from.currentLoad - 1) });
    await repo.update(toWarehouseId, { currentLoad: to.currentLoad + 1 });

    await shipmentRepo.update(shipmentId, { warehouseId: Number(toWarehouseId) });

    return {
      shipmentId: Number(shipmentId),
      movedFrom: fromWarehouseId,
      movedTo: toWarehouseId,
    };
  },
};