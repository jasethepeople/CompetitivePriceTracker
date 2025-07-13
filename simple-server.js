const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Companies endpoint
app.get('/api/companies', (req, res) => {
  res.json([]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Business Intelligence Tool ready`);
});