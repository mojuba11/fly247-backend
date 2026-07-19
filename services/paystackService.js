const axios = require('axios');

const initializeTransaction = async (email, amount) => {
  const response = await axios.post('https://api.paystack.co/transaction/initialize', {
    email,
    amount: amount * 100, // Paystack uses Kobo
  }, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });
  return response.data;
};

module.exports = { initializeTransaction };