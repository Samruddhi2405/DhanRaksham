const mongoose = require('mongoose');

const InsurancePredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: { type: Object, required: true },
  prediction_summary: { type: Object, required: true },
  recommendations: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InsurancePrediction', InsurancePredictionSchema); 