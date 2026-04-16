class Warehouse {
  constructor({ id, name, location, capacity, currentLoad }) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.capacity = capacity;          
    this.currentLoad = currentLoad || 0; 
    this.createdAt = new Date().toISOString();
  }
}
 
module.exports = Warehouse;