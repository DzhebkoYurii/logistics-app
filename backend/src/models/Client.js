class Client {
  constructor({ id, name, email, phone, address }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone || null;
    this.address = address || null;
    this.createdAt = new Date().toISOString();
  }
}
 
module.exports = Client;