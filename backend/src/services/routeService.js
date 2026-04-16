const repo = require('../repositories/routeRepository');
const transportRepo = require('../repositories/transportRepository');

module.exports = {
  getAll: () => repo.findAll(),

  getById: (id) => {
    const route = repo.findById(id);
    if (!route) throw { status: 404, message: `Route with id=${id} not found` };
    return route;
  },

  create: (data) => {
    if (data.transportId && !transportRepo.exists(data.transportId)) {
      throw { status: 400, message: `Transport with id=${data.transportId} does not exist` };
    }
    return repo.create(data);
  },

  update: (id, data) => {
    if (!repo.exists(id)) throw { status: 404, message: `Route with id=${id} not found` };
    if (data.transportId && !transportRepo.exists(data.transportId)) {
      throw { status: 400, message: `Transport with id=${data.transportId} does not exist` };
    }
    return repo.update(id, data);
  },

  remove: (id) => {
    if (!repo.exists(id)) throw { status: 404, message: `Route with id=${id} not found` };
    repo.remove(id);
  },

  // "оптимізація маршруту"
  // спрощена: знаходимо маршрут з найменшою відстанню між двома точками серед існуючих. 
  // Далі — алгоритм Дейкстри або API.
  optimize: (origin, destination) => {
    if (!origin || !destination) {
      throw { status: 400, message: 'Both origin and destination are required' };
    }

    const candidates = repo.findAll().filter(
      r => r.origin.toLowerCase() === origin.toLowerCase() &&
           r.destination.toLowerCase() === destination.toLowerCase()
    );

    if (!candidates.length) {
      throw {
        status: 404,
        message: `No routes found from "${origin}" to "${destination}"`,
      };
    }

    // найоптимальніший = найкоротша відстань
    const optimal = candidates.reduce((best, r) =>
      r.distanceKm < best.distanceKm ? r : best
    );

    return {
      optimal,
      alternatives: candidates.filter(r => r.id !== optimal.id),
      totalCandidates: candidates.length,
    };
  },
};