const Booking = require('../models/Booking');
const User = require('../models/User');

// Get high-level stats for the Dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalUsers = await User.countDocuments();

    res.json({
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of all bookings for the Bookings Management page
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of all users for the User Management page
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (Confirm/Cancel)
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

module.exports = { 
  getDashboardStats, 
  getAllBookings, 
  getAllUsers, 
  updateBookingStatus 
};