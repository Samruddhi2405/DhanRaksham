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

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DhanRaksham
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment Setup**
   
   Copy the example environment file and configure it:
   ```bash
   cp env.example Backend/config.env
   ```
   
   Edit `Backend/config.env` with your actual values. See [SETUP.md](SETUP.md) for detailed configuration instructions.

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Python FastAPI Server** (for ML models)
   ```bash
   cd Backend
   python main.py
   ```

3. **Start Node.js Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```

4. **Start React Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - ML API: http://localhost:8000

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

## 🤖 Machine Learning Models

The application uses several ML models for predictions:

- **Stock Prediction Model**: Random Forest Regressor for stock returns
- **Insurance Amount Model**: Predicts optimal insurance coverage

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GEMINI_API_KEY` | Google Generative AI API key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |

### API Keys Required

- **Google Generative AI**: For chatbot functionality
- **MongoDB Atlas** (optional): For cloud database

## 🚀 Deployment

### Frontend Deployment
```bash
cd Frontend
npm run build
```

### Backend Deployment
```bash
cd Backend
npm start
```

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
