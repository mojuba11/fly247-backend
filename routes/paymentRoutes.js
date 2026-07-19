const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/paymentController');

// Paystack will POST to this URL
router.post('/webhook', handleWebhook);

module.exports = router;