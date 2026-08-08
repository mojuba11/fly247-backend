const express = require('express');
const router = express.Router();
const skylinkApi = require('../services/skylinkService');

// 1. Flight Search Endpoint
router.post('/search', async (req, res) => {
  try {
    // Ensure search_mode is set to external for live supplier inventory[cite: 1]
    const payload = { search_mode: 'external', ...req.body };
    const response = await skylinkApi.post('/flights/search', payload);

    // Apply a 5% retail markup to the raw supplier flight prices
    if (response.data && response.data.success && response.data.data && response.data.data.flights) {
      response.data.data.flights = response.data.data.flights.map(flight => {
        const originalPrice = flight.price;
        const markupPrice = Math.round(originalPrice * 1.05);
        
        return {
          ...flight,
          price: markupPrice,      // Retail price displayed to your customers
          base_price: originalPrice // Original supplier wholesale price for your internal records
        };
      });
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
});

// 2. Flight Pricing / Verification Endpoint
router.post('/pricing', async (req, res) => {
  try {
    // Re-validates pricing and returns a fresh booking_token[cite: 1]
    const response = await skylinkApi.post('/flights/pricing', req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
});

// 3. Flight Reservation & PNR Generation Endpoint
router.post('/reserve', async (req, res) => {
  try {
    /* 
      CRITICAL PAYMENT OBLIGATION CHECK:
      Per SkyLink terms, you must ensure full payment has been collected and 
      confirmed on your platform before calling this endpoint[cite: 1]. 
      Always verify your internal transaction database or payment gateway 
      status here before proceeding.
    */
    const paymentConfirmed = true; // Replace this with your actual database/payment check logic

    if (!paymentConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Payment must be confirmed before generating a flight reservation."
      });
    }

    // Submits passenger details and updated booking_token to generate live PNR[cite: 1]
    const response = await skylinkApi.post('/flights/reserve', req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
      blocked: error.response?.data?.blocked || false
    });
  }
});

module.exports = router;
