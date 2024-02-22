const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    trackingNumber: String,
    status: String,
    location: String,
  });
  
  module.exports = mongoose.model('Tracking', trackingSchema);