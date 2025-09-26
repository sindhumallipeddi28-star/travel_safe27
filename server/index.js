require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToServer } = require('./db');
const tripsRouter = require('./routes/trips');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/trips', tripsRouter);

// Start server after DB connection
connectToServer((err) => {
  if (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
