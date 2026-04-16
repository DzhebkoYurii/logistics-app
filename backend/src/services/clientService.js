const repo = require('../repositories/clientRepository');
const shipmentRepo = require('../repositories/shipmentRepository');

module.exports = {
  getAll: () => repo.findAll(),

  getById: (id) => {
    const client = repo.findById(id);
    if (!client) throw { status: 404, message: `Client with id=${id} not found` };
    return client;
  },

  create: (data) => {
    const duplicate = repo.findAll().find(c => c.email === data.email);
    if (duplicate) throw { status: 409, message: `Email "${data.email}" is already in use` };
    return repo.create(data);
  },

  update: (id, data) => {
    if (!repo.exists(id)) throw { status: 404, message: `Client with id=${id} not found` };

    if (data.email) {
      const duplicate = repo.findAll().find(c => c.email === data.email && c.id !== Number(id));
      if (duplicate) throw { status: 409, message: `Email "${data.email}" is already in use` };
    }

    return repo.update(id, data);
  },

  remove: (id) => {
    if (!repo.exists(id)) throw { status: 404, message: `Client with id=${id} not found` };

    const hasShipments = shipmentRepo.findByClientId(id).length > 0;
    if (hasShipments) {
      throw { status: 409, message: `Cannot delete client id=${id}: has active shipments` };
    }

    repo.remove(id);
  },
};