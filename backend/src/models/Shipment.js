class Shipment {
  constructor({ id, trackingNumber, weight, description, clientId, warehouseId, routeId }) {
    this.id = id;
    this.trackingNumber = trackingNumber || `TRK-${Date.now()}-${id}`;
    this.weight = weight;             
    this.description = description || null;
    this.clientId = clientId;           
    this.warehouseId = warehouseId || null; 
    this.routeId = routeId || null;     
    this.createdAt = new Date().toISOString();
  }
}
 
module.exports = Shipment;