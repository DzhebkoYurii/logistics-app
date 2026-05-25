const repo = require('../repositories/routeRepository');
const transportRepo = require('../repositories/transportRepository');

module.exports = {
  getAll: async () => await repo.findAll(),

  getById: async (id) => {
    const route = await repo.findById(id);
    if (!route) throw { status: 404, message: `Route with id=${id} not found` };
    return route;
  },

  create: async (data) => {
    if (data.transportId && !(await transportRepo.exists(data.transportId))) {
      throw { status: 400, message: `Transport with id=${data.transportId} does not exist` };
    }
    return await repo.create(data);
  },

  update: async (id, data) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Route with id=${id} not found` };
    if (data.transportId && !(await transportRepo.exists(data.transportId))) {
      throw { status: 400, message: `Transport with id=${data.transportId} does not exist` };
    }
    return await repo.update(id, data);
  },

  remove: async (id) => {
    if (!(await repo.exists(id))) throw { status: 404, message: `Route with id=${id} not found` };
    await repo.remove(id);
  },

  optimize: async (origin, destinations) => {
    if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
      throw { status: 400, message: 'Origin and an array of destinations are required' };
    }

    let uncovered = [...new Set(destinations.map(d => d.toLowerCase()))];
    const plan = [];
    
    const allRoutes = await repo.findAll();
    const availableRoutes = allRoutes.filter(
      r => r.origin.toLowerCase() === origin.toLowerCase()
    );

    while (uncovered.length > 0) {
      let bestRoute = null;
      let bestCoveredForThisStep = [];

      for (const route of availableRoutes) {
        // Якщо це Sequelize масив, waypoints можуть потребувати перевірки
        const waypoints = route.waypoints || []; 
        const coveredByThisRoute = uncovered.filter(city => 
          route.destination.toLowerCase() === city ||
          waypoints.some(wp => wp.toLowerCase() === city)
        );

        if (coveredByThisRoute.length > (bestCoveredForThisStep.length)) {
          bestRoute = route;
          bestCoveredForThisStep = coveredByThisRoute;
        } 
        else if (coveredByThisRoute.length === bestCoveredForThisStep.length && 
                bestCoveredForThisStep.length > 0 &&
                route.distanceKm < bestRoute.distanceKm) {
          bestRoute = route;
        }
      }

      if (!bestRoute || bestCoveredForThisStep.length === 0) break;

      plan.push({
        routeId: bestRoute.id,
        path: `${bestRoute.origin} -> ${bestRoute.destination}`,
        distance: bestRoute.distanceKm,
        coveredCities: bestCoveredForThisStep,
        waypoints: bestRoute.waypoints
      });

      uncovered = uncovered.filter(city => !bestCoveredForThisStep.includes(city));
    }

    return {
      origin,
      deliveryPlan: plan,
      totalRoutesUsed: plan.length,
      unreachableCities: uncovered, 
      status: uncovered.length === 0 ? 'Full coverage achieved' : 'Partial coverage'
    };
  },
};