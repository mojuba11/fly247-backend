const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net', // Replace with your SMTP provider host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Sends a booking confirmation email
 */
const sendBookingConfirmation = async (email, bookingDetails) => {
  await transporter.sendMail({
    from: '"Fly247 Support" <noreply@fly247.com>',
    to: email,
    subject: 'Your Flight Booking Confirmation',
    html: `
      <h1>Booking Confirmed!</h1>
      <p>Thank you for booking with Fly247.</p>
      <p><strong>Booking Reference:</strong> ${bookingDetails.reference}</p>
      <p>Please keep this email for your records.</p>
      <br />
      <p>Safe travels!</p>
    `,
  });
};

/**
 * Sends a welcome email upon registration
 */
const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: '"Fly247 Support" <noreply@fly247.com>',
    to: email,
    subject: 'Welcome to Fly247!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your Fly247 account has been successfully created.</p>
      <p>We are excited to help you find your next adventure. Start searching for flights today!</p>
      <br />
      <p>The Fly247 Team</p>
    `,
  });
};

module.exports = { 
  sendBookingConfirmation, 
  sendWelcomeEmail 
};