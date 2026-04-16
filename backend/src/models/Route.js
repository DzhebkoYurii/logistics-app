class Route {
  constructor({ id, origin, destination, distanceKm, estimatedHours, transportId, waypoints }) {
    this.id = id;
    this.origin = origin;               
    this.destination = destination;    
    this.distanceKm = distanceKm;
    this.estimatedHours = estimatedHours;
    this.transportId = transportId || null; 
    this.waypoints = waypoints || [];  
    this.createdAt = new Date().toISOString();
  }
}
 
module.exports = Route;