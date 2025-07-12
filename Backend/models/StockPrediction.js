const mongoose = require('mongoose');

const StockPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment_amount: { type: Number, required: true },
  num_stocks: { type: Number, required: true },
  risk_level: { type: String, required: true },
  prediction: { type: Number, required: true },
  expected_return: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockPrediction', StockPredictionSchema); 