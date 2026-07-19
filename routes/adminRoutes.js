const express = require('express');
const router = express.Router();

// Import Controller
const { 
    getDashboardStats, 
    getAllBookings, 
    getAllUsers, 
    updateBookingStatus 
} = require('../controllers/adminController');

// Import Middleware
// We import them as a single object to ensure everything is loaded correctly
const authMiddleware = require('../middleware/authMiddleware');
const { protect, isAdmin } = authMiddleware;

// Routes
router.get('/stats', protect, isAdmin, getDashboardStats);
router.get('/bookings', protect, isAdmin, getAllBookings);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/bookings/:id', protect, isAdmin, updateBookingStatus);

module.exports = router;