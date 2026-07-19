const mongoose = require('mongoose');
const User = require('../models/User');
const Booking = require('../models/Booking');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Create a Mock User
  const mockUser = await User.create({
    name: 'Test Traveler',
    email: 'traveler@example.com',
    password: 'password123',
    role: 'user'
  });

  // 2. Create a Mock Booking
  await Booking.create({
    user: mockUser._id,
    paymentReference: 'REF-' + Date.now(),
    status: 'pending',
    amount: 50000
  });

  console.log('Mock user and booking created!');
  process.exit();
};

seedData();