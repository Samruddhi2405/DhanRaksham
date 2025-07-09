const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Add error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Require app AFTER dotenv, BEFORE using any routes
const app = require("./app");

// Add detailed logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

const portnumber = 3001;

// Add error handling for the server
const server = app.listen(portnumber, '0.0.0.0', (error) => {
  if (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${portnumber}`);
  console.log("Available routes:");
  console.log("- POST /api/predict-stock");
  console.log("- POST /api/predict_insurance");
  console.log("- POST /api/finance");
  console.log("- POST /api/finance/structured");
  console.log("- POST /api/finance/unified");
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${portnumber} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
