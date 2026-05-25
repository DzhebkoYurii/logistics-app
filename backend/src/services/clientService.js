const repo = require('../repositories/clientRepository');
const shipmentRepo = require('../repositories/shipmentRepository');

module.exports = {
  getAll: async () => await repo.findAll(),

  getById: async (id) => {
    const client = await repo.findById(id);
    if (!client) throw { status: 404, message: `Client with id=${id} not found` };
    return client;
  },

  create: async (data) => {
    const clients = await repo.findAll();
    const duplicate = clients.find(c => c.email === data.email);
    if (duplicate) throw { status: 409, message: `Email "${data.email}" is already in use` };
    return await repo.create(data);
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Client with id=${id} not found` };

    if (data.email) {
      const clients = await repo.findAll();
      const duplicate = clients.find(c => c.email === data.email && c.id !== Number(id));
      if (duplicate) throw { status: 409, message: `Email "${data.email}" is already in use` };
    }

    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Client with id=${id} not found` };

    const shipments = await shipmentRepo.findByClientId(id);
    if (shipments.length > 0) {
      throw { status: 409, message: `Cannot delete client id=${id}: has active shipments` };
    }

    await repo.remove(id);
  },
};