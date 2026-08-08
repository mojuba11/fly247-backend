// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Database Connection
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const flightRoutes = require('./routes/flightRoutes'); // Added SkyLink Flight Routes

const app = express();

// Middleware
// Explicitly using your Vercel URL as the default to prevent CORS issues
const allowedOrigin = process.env.FRONTEND_URL || "https://fly247-frontend-khaki.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Connect to Database
connectDB();

// Root route to handle GET / requests gracefully
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Fly247 API is running smoothly!' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/flights', flightRoutes); // Mounted SkyLink Flight Routes

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// IMPORTANT: Use '0.0.0.0' for Render compatibility and dynamic PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
