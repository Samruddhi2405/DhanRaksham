const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  dependents: String,
  occupation: String,
  cityTier: String,
  rent: String,
  loanRepayment: String,
  insurance: String,
  optimizationResult: Object
});

module.exports = mongoose.model('Budget', BudgetSchema);
