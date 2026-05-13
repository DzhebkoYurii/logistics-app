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

  optimize: (origin, destinations) => {
    if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
      throw { status: 400, message: 'Origin and an array of destinations are required' };
    }

    let uncovered = [...new Set(destinations.map(d => d.toLowerCase()))];
    const plan = [];
    
    // Беремо всі маршрути, що починаються з нашої точки А
    const availableRoutes = repo.findAll().filter(
      r => r.origin.toLowerCase() === origin.toLowerCase()
    );

    // Поки у нас є міста, які не ввійшли в план, і є доступні маршрути
    while (uncovered.length > 0) {
      let bestRoute = null;
      let bestCoveredForThisStep = [];

      for (const route of availableRoutes) {
        // Перевіряємо, скільки НЕПОКРИТИХ міст закриває цей конкретний маршрут
        const coveredByThisRoute = uncovered.filter(city => 
          route.destination.toLowerCase() === city ||
          route.waypoints.some(wp => wp.toLowerCase() === city)
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

      // Видаляємо щойно покриті міста зі списку очікування
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