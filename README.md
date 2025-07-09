# Ty-DSBD: Financial Advisory & Insurance Prediction System 🚀

![GitHub](https://img.shields.io/github/license/Project-Ty-collab/Ty-DSBD)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue)

A sophisticated financial advisory system powered by Google's Gemini AI, combined with machine learning-based insurance prediction capabilities. This project provides both structured and narrative financial advice along with intelligent insurance premium predictions.

## ✨ Features

### Financial Advisory System 💹
- Expert-level financial guidance with 70+ years of simulated experience
- Structured JSON responses for technical queries
- Narrative-style responses for general financial advice
- Comprehensive market analysis and historical context
- Risk assessment and management recommendations

### Insurance Prediction System 🎯
- Machine learning-based insurance premium prediction
- Real-time API integration
- Accurate cost estimations based on multiple factors

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI/ML**: Google Gemini API, Python scikit-learn
- **APIs**: RESTful architecture
- **Development**: JavaScript, Python
- **Documentation**: OpenAPI/Swagger

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- Python (>= 3.8)
- npm or yarn
- Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Project-Ty-collab/Ty-DSBD.git
   cd Ty-DSBD
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `config.env.example` to `config.env`
   - Add your Gemini API key and other required credentials

### Running the Application

1. Start the Node.js backend server:
   ```bash
   npm start
   ```

2. In a new terminal, start the Python prediction service:
   ```bash
   python fly.py
   ```

The application should now be running at:
- Node.js Backend: `http://localhost:3000`
- Python Prediction Service: `http://localhost:5000`

## 🔄 API Endpoints

### Finance APIs
- `POST /api/finance` - Get narrative financial advice
- `POST /api/finance/structured` - Get structured JSON financial advice
- `POST /api/finance/unified` - Get auto-formatted financial advice

### Insurance APIs
- `POST /api/predict_insurance` - Get insurance premium predictions

## 📝 API Usage Examples

### Financial Advice Request
```json
POST /api/finance
{
    "query": "What are the best retirement planning strategies for someone in their 30s?"
}
```

### Insurance Prediction Request
```json
POST /api/predict_insurance
{
    "age": 30,
    "bmi": 22.5,
    "smoker": "no",
    "region": "southwest"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the financial advisory system
- scikit-learn for machine learning capabilities
- All contributors who helped shape this project

---

Made with ❤️ by Project-Ty-collab team
