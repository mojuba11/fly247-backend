const Amadeus = require('amadeus');
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

const getFlightOffers = async (params) => {
  return await amadeus.shopping.flightOffersSearch.get(params);
};

module.exports = { getFlightOffers };