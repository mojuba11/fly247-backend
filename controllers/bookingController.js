const { initializeTransaction } = require('../services/paystackService');
const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  const { user, flight, amount, email } = req.body;

  try {
    // 1. Initialize payment via Paystack
    const payment = await initializeTransaction(email, amount);

    // 2. Save a pending booking in your MongoDB
    const newBooking = await Booking.create({
      user,
      flight,
      status: 'pending',
      paymentReference: payment.data.reference
    });

    // 3. Send the payment URL to the frontend so the user can pay
    res.status(201).json({ 
      booking: newBooking, 
      paymentUrl: payment.data.authorization_url 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};