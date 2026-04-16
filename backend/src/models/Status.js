// Можливі коди:
//   PENDING     — щойно створено, ще не обробляється
//   PROCESSING  — прийнято на склад, готується до відправки
//   IN_TRANSIT  — в дорозі
//   DELIVERED   — доставлено одержувачу
//   CANCELLED   — скасовано
//   RETURNED    — повернено відправнику
 
const VALID_CODES = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
 
class Status {
  constructor({ id, shipmentId, code, note }) {
    if (!VALID_CODES.includes(code)) {
      throw new Error(`Invalid status code. Allowed: ${VALID_CODES.join(', ')}`);
    }
    this.id = id;
    this.shipmentId = shipmentId; 
    this.code = code;
    this.note = note || null;     
    this.createdAt = new Date().toISOString(); 
  }
}
 
Status.VALID_CODES = VALID_CODES;
 
module.exports = Status;