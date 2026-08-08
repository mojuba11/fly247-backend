const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction'); // Ensure your Transaction model is set up
const { handleWebhook } = require('../controllers/paymentController');

// Paystack will POST webhooks to this URL
router.post('/webhook', handleWebhook);

// Verify Payment Endpoint (called by your frontend after a successful checkout)
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required."
      });
    }

    // Call Paystack API to verify transaction using your secret key from environment variables
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const paystackData = response.data;

    if (paystackData.status && paystackData.data.status === 'success') {
      const transactionInfo = {
        transactionId: paystackData.data.reference,
        amount: paystackData.data.amount / 100, // Paystack returns amounts in kobo/sub-units
        email: paystackData.data.customer?.email,
        status: 'success',
        metadata: paystackData.data.metadata || {}
      };

      // Save or update transaction in your database so flightRoutes.js can check it
      await Transaction.findOneAndUpdate(
        { transactionId: reference },
        transactionInfo,
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully and recorded.",
        data: paystackData.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed or transaction was not successful."
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Internal server error during payment verification."
    });
  }
});

module.exports = router;
