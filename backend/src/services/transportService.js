const repo = require('../repositories/transportRepository');
const routeRepo = require('../repositories/routeRepository');

const VALID_TYPES = ['truck', 'van', 'motorcycle'];

module.exports = {
  getAll: async () => await repo.findAll(),

  getById: async (id) => {
    const transport = await repo.findById(id);
    if (!transport) throw { status: 404, message: `Transport with id=${id} not found` };
    return transport;
  },

  getAvailable: async () => await repo.findAvailable(),

  create: async (data) => {
    if (!VALID_TYPES.includes(data.type)) {
      throw { status: 400, message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` };
    }
    return await repo.create(data);
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Transport with id=${id} not found` };
    if (data.type && !VALID_TYPES.includes(data.type)) {
      throw { status: 400, message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` };
    }
    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Transport with id=${id} not found` };

    const routes = await routeRepo.findByTransportId(id);
    if (routes.length > 0) {
      throw { status: 409, message: `Cannot delete transport id=${id}: assigned to active routes` };
    }

    await repo.remove(id);
  },
};