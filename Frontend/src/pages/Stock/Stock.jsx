import React, { useState } from 'react';
import './Stock.css';

const Stock = () => {
  const [amount, setAmount] = useState('');
  const [stocks, setStocks] = useState('');
  const [risk, setRisk] = useState('Low');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!amount || !stocks) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Investment amount must be greater than 0');
      return;
    }

    if (parseInt(stocks) <= 0) {
      setError('Number of stocks must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        investment_amount: parseFloat(amount),
        num_stocks: parseInt(stocks),
        risk_level: risk
      };

      // Try ports in order of priority
      const ports = [5000];  // 3001 is the primary port
      let lastError = null;

      for (const port of ports) {
        try {
          console.log(`Attempting to connect to port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api/predict-stock`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Received response:', data);
            setPrediction({
              amount: parseFloat(amount),
              rate: (data.prediction * 100).toFixed(2),
              return: data.expected_return.toFixed(2)
            });
            return; // Success, exit the function
          } else {
            console.log(`Port ${port} responded with status:`, response.status);
            const errorText = await response.text();
            console.log(`Port ${port} error response:`, errorText);
          }
        } catch (err) {
          console.log(`Failed to connect to port ${port}:`, err);
          lastError = err;
        }
      }

      // If we get here, all ports failed
      throw lastError || new Error('Failed to connect to any server port');
    } catch (err) {
      console.error('Prediction error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });

      let errorMessage = 'An error occurred while making the prediction. ';
      
      if (err.message === 'Failed to fetch') {
        errorMessage += 'Please check if the backend server is running. Try these steps:\n';
        errorMessage += '1. Make sure the Backend server is running on port 5000 (cd Backend && nodemon server.js)\n';
        errorMessage += '2. Make sure the FastAPI server is running on port 8000 (uvicorn main:app --reload)\n';
        errorMessage += '3. Check if ports 5000 and 8000 are available\n';
        errorMessage += '4. Check if your firewall is blocking these ports';
      } else {
        errorMessage += err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-section">
      <div className="container stock-container">
        <h2 className="section-title">Stock Predictor</h2>
        <p className="section-subtitle">Enter your details to get a stock return prediction</p>

        <label className="stock-label">Investment Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="stock-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
        />

        <label className="stock-label">Number of Stocks</label>
        <input
          type="number"
          placeholder="Enter number of stocks"
          className="stock-input stocks-input"
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
          min="1"
        />

        <label className="stock-label">Risk Factor</label>
        <select
          className="stock-input"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button 
          className="stock-button"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <br />
            <small>Please make sure all servers are running and try again.</small>
          </div>
        )}
        
        {prediction && (
          <div className="stock-prediction">
            <h3 className="prediction-title">Prediction Results</h3>
            <div className="prediction-card">
              <div className="prediction-item">
                <span className="prediction-label">Initial Investment</span>
                <span className="prediction-value">₹{prediction.amount.toLocaleString()}</span>
              </div>
              <div className="prediction-item">
                <span className="prediction-label">Expected Return Rate</span>
                <span className="prediction-value highlight">{prediction.rate}%</span>
              </div>
              <div className="prediction-item">
                <span className="prediction-label">Expected Return Amount</span>
                <span className="prediction-value success">₹{parseFloat(prediction.return).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
