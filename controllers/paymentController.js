const Booking = require('../models/Booking');
const crypto = require('crypto');
const { sendBookingConfirmation } = require('../utils/emailService');

const handleWebhook = async (req, res) => {
  // 1. Verify the event came from Paystack
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                     .update(JSON.stringify(req.body))
                     .digest('hex');
                     
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;

  // 2. If payment is successful, update the booking status
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    const email = event.data.customer.email;

    // Update booking in MongoDB
    const updatedBooking = await Booking.findOneAndUpdate(
      { paymentReference: reference },
      { status: 'confirmed' },
      { new: true } // Returns the updated document
    );

    if (updatedBooking) {
      console.log(`Booking ${reference} confirmed!`);
      
      // 3. Send confirmation email
      try {
        await sendBookingConfirmation(email, {
          reference: updatedBooking._id,
          // You can pass more details here if needed
        });
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }
  }

  res.sendStatus(200); // Always acknowledge receipt to Paystack
};

module.exports = { handleWebhook };