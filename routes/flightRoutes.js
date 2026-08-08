const express = require('express');
const router = express.Router();
const skylinkApi = require('../services/skylinkService');
const Transaction = require('../models/Transaction'); // Import Transaction model for database verification

// 1. Flight Search Endpoint
router.post('/search', async (req, res) => {
  try {
    // Ensure search_mode is set to external for live supplier inventory
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
    // Re-validates pricing and returns a fresh booking_token
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
      confirmed on your platform before calling this endpoint. 
      We verify the transaction record saved by paymentRoutes.js in MongoDB.
    */
    const { transactionId, reference, ...restBody } = req.body;
    const paymentRef = transactionId || reference;

    if (!paymentRef) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required to verify payment before booking."
      });
    }

    // Check database to confirm payment was successful
    const paymentRecord = await Transaction.findOne({ 
      transactionId: paymentRef, 
      status: 'success' 
    });

    if (!paymentRecord) {
      return res.status(400).json({
        success: false,
        message: "Payment must be confirmed and verified before generating a flight reservation."
      });
    }

    // Submits passenger details and updated booking_token to generate live PNR
    const response = await skylinkApi.post('/flights/reserve', restBody);
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
