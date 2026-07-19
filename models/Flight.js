const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, default: 30 },
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);