// Step 2 complete: MongoDB Atlas connected ✅
// Step 4 complete: Product API connected to Open Food Facts ✅
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const compareRoutes = require('./routes/compare');
app.use('/api/product/compare', compareRoutes);

const productRoutes = require('./routes/product');
app.use('/api/product', productRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Cartico Backend is running! 🚀' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Cartico server running on http://localhost:${PORT}`);
});

//remaining 