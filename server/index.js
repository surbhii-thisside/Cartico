const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Cartico Backend is running! 🚀' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Cartico server running on http://localhost:${PORT}`);
});
