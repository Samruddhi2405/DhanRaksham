const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const AppError = require("./utils/appErrors");
const app = express();
const cors = require("cors");
const axios = require("axios");
const chatController = require("./controllers/chat");
const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbotRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Authorization"
    ],
  })
);

// Add this at the top of your routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Use auth routes
app.use("/api/auth", authRoutes);

// Use chatbot routes
app.use("/api/chatbot", chatbotRoutes);

// Route to call the predict_insurance API from the Flask server
app.post("/api/predict_insurance", async (req, res, next) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/predict_insurance",
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      message: "Failed to call the predict_insurance API",
    });
  }
});

// Stock prediction route
app.post("/api/predict-stock", async (req, res, next) => {
  try {
    console.log("Received stock prediction request:", req.body);
    const response = await axios.post(
      "http://localhost:8000/predict-stock",
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Stock prediction response:", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Stock prediction error:", error);
    res.status(error.response?.status || 500).json({
      error: error.message,
      message: "Failed to call the stock prediction API",
    });
  }
});

// Finance API routes
app.post("/api/finance", chatController.getFinanceResponse);
app.post("/api/finance/structured", chatController.getStructuredFinanceResponse);
app.post("/api/finance/unified", chatController.getUnifiedFinanceResponse);
// app.post("/api/chat", chatController.getGeneralResponse);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl} url`));
});

module.exports = app;
