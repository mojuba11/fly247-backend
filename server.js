const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
// Replace the URL below with your actual Vercel frontend URL once deployed
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Use environment variable for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Connect to Database
connectDB();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// IMPORTANT: Use '0.0.0.0' for Render compatibility
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
