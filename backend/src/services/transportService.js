const repo = require('../repositories/transportRepository');
const routeRepo = require('../repositories/routeRepository');

const VALID_TYPES = ['truck', 'van', 'motorcycle'];

module.exports = {
  getAll: () => repo.findAll(),

  getById: (id) => {
    const transport = repo.findById(id);
    if (!transport) throw { status: 404, message: `Transport with id=${id} not found` };
    return transport;
  },

  getAvailable: () => repo.findAvailable(),

  create: (data) => {
    if (!VALID_TYPES.includes(data.type)) {
      throw { status: 400, message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` };
    }
    return repo.create(data);
  },

  update: (id, data) => {
    if (!repo.exists(id)) throw { status: 404, message: `Transport with id=${id} not found` };
    if (data.type && !VALID_TYPES.includes(data.type)) {
      throw { status: 400, message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` };
    }
    return repo.update(id, data);
  },

  remove: (id) => {
    if (!repo.exists(id)) throw { status: 404, message: `Transport with id=${id} not found` };

    const hasRoutes = routeRepo.findByTransportId(id).length > 0;
    if (hasRoutes) {
      throw { status: 409, message: `Cannot delete transport id=${id}: assigned to active routes` };
    }

    repo.remove(id);
  },
};