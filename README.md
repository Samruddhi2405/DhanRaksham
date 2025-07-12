# DhanRaksham - AI-Powered Financial Management Platform

<div align="center">
  <img src="Frontend/src/assets/logo.png" alt="DhanRaksham Logo" width="200"/>
  
  [![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![Python](https://img.shields.io/badge/Python-FastAPI-red.svg)](https://python.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
</div>

## 🚀 Overview

DhanRaksham is a comprehensive financial management platform that combines AI-powered insights with user-friendly tools to help users manage their finances effectively. The platform offers stock prediction, insurance advice, budget optimization, and an intelligent chatbot for financial guidance.

## ✨ Features

### 🛡️ Insurance Predictor
- AI-powered insurance recommendations based on personal data
- Risk assessment and coverage amount suggestions
- Personalized insurance plans tailored to individual needs

### 📈 Stock Predictor
- Machine learning-based stock trend predictions
- Investment amount optimization
- Risk level analysis (Low, Medium, High)
- Expected return calculations

### 💬 AI Chatbot Advisor
- 24/7 intelligent financial guidance
- Instant answers to finance-related questions
- Powered by Google's Generative AI

### 💰 Budget Optimizer
- Track and analyze spending patterns
- Personalized budget recommendations
- Financial goal setting and monitoring

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and user profiles

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **CSS3** - Styling and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication

### AI/ML Services
- **Python FastAPI** - ML model serving
- **Scikit-learn** - Machine learning models
- **Joblib** - Model serialization
- **Google Generative AI** - Chatbot intelligence

### DevOps & Tools
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment management
- **Nodemon** - Development server
- **ESLint** - Code linting

## 📁 Project Structure

```
DhanRaksham/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   └── assets/          # Static assets
│   ├── package.json
│   └── vite.config.js
├── Backend/                  # Node.js backend server
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── services/           # Business logic
│   ├── models/             # ML model files
│   ├── main.py             # Python FastAPI server
│   └── server.js           # Express server
├── models/                  # Shared ML models
├── config/                  # Configuration files
└── README.md
```

## 🤖 Machine Learning Models & Model Training

The application uses several ML models for predictions:

- **Stock Prediction Model**: DecisionTreeRegressor for stock returns
- **Insurance Amount Model**: Predicts optimal insurance coverage

## Model Training & Setup

**Before running the backend, you must train and save the ML models:**

1. **Train the Stock Model**
   - From your project root, run:
     ```bash
     python train_stock_model.py
     ```
   - This will create `Backend/models/stock_model.pkl` and `Backend/models/scaler.pkl`.

2. **Verify Model Files**
   - Ensure both files exist in `Backend/models/` before starting the FastAPI backend.

3. **Absolute Path Loading**
   - The FastAPI backend loads models using absolute paths, so it works regardless of your working directory.

4. **Model Compatibility**
   - Always use the same Python and scikit-learn versions for training and serving models. List dependencies in `requirements.txt`.

## 🛠️ Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Train ML Models** (if not already done)
   ```bash
   python train_stock_model.py
   ```

3. **Start Python FastAPI Server** (for ML models)
   - From the `Backend/` directory:
     ```bash
     uvicorn main:app --reload --port 8000
     ```
   - Or from the project root:
     ```bash
     uvicorn Backend.main:app --reload --port 8000
     ```

4. **Start Node.js Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```

5. **Start React Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - ML API: http://localhost:8000

## 🐞 Troubleshooting Model Errors

- **FileNotFoundError**: If you see `No such file or directory: 'Backend/models/stock_model.pkl'`, make sure you have run the training script and the files exist.
- **monotonic_cst Error**: If you see `'DecisionTreeRegressor' object has no attribute 'monotonic_cst'`, delete all old model files, retrain using the provided script, and restart your backend.
- **ECONNREFUSED**: If you see this error, make sure your FastAPI server is running on port 8000.
- **Path Issues**: The backend now uses absolute paths for model loading, so you can run the server from any directory.

## 🚀 Deployment Best Practices

- **Include model files**: Ensure `Backend/models/stock_model.pkl` and `scaler.pkl` are present in your deployment package.
- **Use absolute paths**: The backend is set up for this.
- **Match Python/scikit-learn versions**: Use the same versions in production as in development.
- **Test after deployment**: Always test the prediction endpoints after deploying.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile

### Budget Management
- `GET /api/budget` - Get user budgets
- `POST /api/budget` - Create new budget
- `PUT /api/budget/:id` - Update budget
- `DELETE /api/budget/:id` - Delete budget

### AI Services
- `POST /api/chatbot/advice` - Get chatbot advice
- `POST /api/predict-stock` - Stock prediction
- `POST /api/predict-insurance` - Insurance prediction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact

For any inquiries, collaborations, or support, please feel free to contact us.

---
