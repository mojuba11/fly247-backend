const Flight = require('../models/Flight');

const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFlights };