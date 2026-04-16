const repo = require('../repositories/warehouseRepository');
const shipmentRepo = require('../repositories/shipmentRepository');

module.exports = {
  getAll: () => repo.findAll().map(w => ({
    ...w,
    availableCapacity: w.capacity - w.currentLoad,  
  })),

  getById: (id) => {
    const warehouse = repo.findById(id);
    if (!warehouse) throw { status: 404, message: `Warehouse with id=${id} not found` };
    return { ...warehouse, availableCapacity: warehouse.capacity - warehouse.currentLoad };
  },

  create: (data) => {
    if (data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return repo.create(data);
  },

  update: (id, data) => {
    if (!repo.exists(id)) throw { status: 404, message: `Warehouse with id=${id} not found` };
    if (data.currentLoad !== undefined && data.capacity !== undefined &&
        data.currentLoad > data.capacity) {
      throw { status: 400, message: 'currentLoad cannot exceed capacity' };
    }
    return repo.update(id, data);
  },

  remove: (id) => {
    if (!repo.exists(id)) throw { status: 404, message: `Warehouse with id=${id} not found` };

    const hasShipments = shipmentRepo.findByWarehouseId(id).length > 0;
    if (hasShipments) {
      throw { status: 409, message: `Cannot delete warehouse id=${id}: has active shipments` };
    }

    repo.remove(id);
  },

  transferShipment: (shipmentId, fromWarehouseId, toWarehouseId) => {
    const from = repo.findById(fromWarehouseId);
    const to = repo.findById(toWarehouseId);

    if (!from) throw { status: 404, message: `Source warehouse id=${fromWarehouseId} not found` };
    if (!to) throw { status: 404, message: `Target warehouse id=${toWarehouseId} not found` };
    if (to.currentLoad >= to.capacity) {
      throw { status: 409, message: `Target warehouse id=${toWarehouseId} is at full capacity` };
    }

    repo.update(fromWarehouseId, { currentLoad: Math.max(0, from.currentLoad - 1) });
    repo.update(toWarehouseId, { currentLoad: to.currentLoad + 1 });

    shipmentRepo.update(shipmentId, { warehouseId: Number(toWarehouseId) });

    return {
      shipmentId: Number(shipmentId),
      movedFrom: fromWarehouseId,
      movedTo: toWarehouseId,
    };
  },
};