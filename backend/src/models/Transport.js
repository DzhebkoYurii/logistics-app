class Transport {
  constructor({ id, licensePlate, type, capacity, driverName, isAvailable }) {
    this.id = id;
    this.licensePlate = licensePlate;   
    this.type = type;                   
    this.capacity = capacity;          
    this.driverName = driverName || null;
    this.isAvailable = isAvailable !== undefined ? isAvailable : true;
    this.createdAt = new Date().toISOString();
  }
}
 
module.exports = Transport;