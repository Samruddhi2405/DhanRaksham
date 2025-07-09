import React, { useState } from 'react';
import './Budget.css';
import axios from 'axios';

const Budget = () => {
  const [formData, setFormData] = useState({
    dependents: '',
    occupation: 'Student',
    cityTier: 'Tier_1',
    rent: '',
    loanRepayment: '',
    insurance: ''
  });

  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOptimizationResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/budget/optimize', formData);
      setOptimizationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while optimizing your budget');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="budget-container">
      <div className="budget-box">
        <h2>FinanceOptimizer</h2>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>Personal Status</h3>
            <div className="grid-3">
              <div className="row">
                <label>Number of Dependents</label>
                <input 
                  type="number" 
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="row">
                <label>Occupation</label>
                <select 
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                >
                  <option value="Student">Student</option>
                  <option value="Employee">Employee</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>
              <div className="row">
                <label>City Tier</label>
                <select 
                  name="cityTier"
                  value={formData.cityTier}
                  onChange={handleInputChange}
                >
                  <option value="Tier_1">Tier 1</option>
                  <option value="Tier_2">Tier 2</option>
                  <option value="Tier_3">Tier 3</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Monthly Fixed Expenses</h3>
            <div className="grid-3">
              <div className="row">
                <label>Rent/Housing</label>
                <input 
                  type="number" 
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="row">
                <label>Loan Repayment</label>
                <input 
                  type="number" 
                  name="loanRepayment"
                  value={formData.loanRepayment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="row">
                <label>Insurance</label>
                <input 
                  type="number" 
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="optimize-button"
            disabled={loading}
          >
            {loading ? 'Optimizing...' : 'Optimize My Budget'}
          </button>
        </form>

        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #dc3545',
            borderRadius: '8px',
            backgroundColor: '#fff5f5'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {optimizationResult && (
          <div className="optimization-result" style={{
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '20px',
              borderBottom: '2px solid #3498db',
              paddingBottom: '10px'
            }}>Optimization Results</h3>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div className="result-section">
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recommended Allocations</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h5 style={{ color: '#3498db', marginBottom: '8px' }}>Housing</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50' }}>
                      {formatCurrency(optimizationResult.recommendedAllocations.housing)}
                    </p>
                  </div>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h5 style={{ color: '#2ecc71', marginBottom: '8px' }}>Savings</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50' }}>
                      {formatCurrency(optimizationResult.recommendedAllocations.savings)}
                    </p>
                  </div>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h5 style={{ color: '#e74c3c', marginBottom: '8px' }}>Investments</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50' }}>
                      {formatCurrency(optimizationResult.recommendedAllocations.investments)}
                    </p>
                  </div>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h5 style={{ color: '#f39c12', marginBottom: '8px' }}>Discretionary</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50' }}>
                      {formatCurrency(optimizationResult.recommendedAllocations.discretionary)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="result-section">
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Total Fixed Expenses</h4>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2c3e50' }}>
                    {formatCurrency(optimizationResult.totalFixedExpenses)}
                  </p>
                </div>
              </div>

              <div className="result-section">
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Recommendations</h4>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {optimizationResult.recommendations.map((rec, index) => (
                      <li key={index} style={{
                        padding: '10px 0',
                        borderBottom: index < optimizationResult.recommendations.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          color: '#3498db',
                          fontSize: '1.2em'
                        }}>•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;

