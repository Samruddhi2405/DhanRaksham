const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const axios = require('axios');
const auth = require('./middleware/auth');
const verifyToken = require('./middleware/verifyToken');

console.log('Starting server initialization...');

// Load environment variables from the local directory
const envPath = path.resolve(__dirname, './config.env');
console.log('Loading environment variables from:', envPath);

// Load environment variables
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

// Debug environment variables
console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'MongoDB URI is set' : 'MongoDB URI is not set',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Gemini API Key is set' : 'Gemini API Key is not set'
});

// Verify required environment variables
const requiredEnvVars = ['GEMINI_API_KEY', 'MONGODB_URI', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

console.log('Initializing Express app...');
const app = express();


//app.use(auth);

// CORS configuration
console.log('Configuring CORS...');
app.use(cors({
    origin: 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
console.log('Setting up middleware...');
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dhanraksham', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
console.log('Setting up routes...');
app.use('/api/budget', budgetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Stock prediction route
app.post('/api/predict-stock', async (req, res) => {
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

// Insurance prediction route
app.post('/api/predict-insurance', async (req, res) => {
    try {
        console.log("Received insurance prediction request:", req.body);
        const response = await axios.post(
            "http://localhost:8000/predict-insurance",
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Insurance prediction response:", response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Insurance prediction error:", error);
        res.status(error.response?.status || 500).json({
            error: error.message,
            message: "Failed to call the insurance prediction API",
        });
    }
});


app.get('/api/user/profile', verifyToken, (req, res) => {
    console.log('req.user:', req.user);
    res.json({ message: `Welcome user ${req.user.userId}` });
  });
  

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
    });
    
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: err.message,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint available at http://localhost:${PORT}/api/chatbot/advice`);
}); 