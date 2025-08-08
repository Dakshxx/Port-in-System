const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  MSISDN: Number,
  ZONE: Number,
  LSA: String,
  OID: Number,
  NRH: Number,
  LRN: Number,
  INT_RN1: String,
  INT_RN2: String,
  LAST_OID: Number,
  STATUS: String,
  CREATE_ON: Date,
  UPDATE_ON: Date,
  PORT_ON: Date,
  UPDATE_FLAG: Number,
  DONOR_LSA: String,
  NRH_LSA: String,
  BC_STATUS: String
}, { collection: 'Subscriber_data' }); // Explicitly tell Mongoose the collection name

module.exports = mongoose.model('Subscriber', subscriberSchema);
