import React, { useState } from 'react';
import { 
  Calculator, 
  Shield, 
  TrendingUp, 
  Heart, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Building,
  User,
  MapPin,
  Activity,
  PieChart,
  CheckCircle,
  Info
} from 'lucide-react';
import './InsuranceAdvisor.css';

const InsuranceAdvisor = () => {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    dependents: '0',
    occupation: 'engineer',
    city_tier: 'tier1',
    healthcare: '',
    bmi: '',
    blood_pressure: '',
    smoker: 'no',
    diabetic: 'no',
    region: 'north',
    children: '0'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const occupationOptions = [
    { value: 'engineer', label: 'Engineer' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'business', label: 'Business Owner' },
    { value: 'govt', label: 'Government Employee' }
  ];

  const cityTierOptions = [
    { value: 'tier1', label: 'Tier 1 (Metro)' },
    { value: 'tier2', label: 'Tier 2' },
    { value: 'tier3', label: 'Tier 3' }
  ];

  const regionOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' }
  ];

  const validateForm = () => {
    const errors = {};
    
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age)) {
      errors.age = 'Age is required';
    } else if (age < 18 || age > 70) {
      errors.age = 'Age must be between 18 and 70';
    }

    const income = parseFloat(formData.income);
    if (!formData.income || isNaN(income)) {
      errors.income = 'Annual income is required';
    } else if (income < 100000) {
      errors.income = 'Income must be at least ₹1,00,000';
    }

    const dependents = parseInt(formData.dependents);
    if (isNaN(dependents)) {
      errors.dependents = 'Please enter a valid number for dependents';
    } else if (dependents < 0) {
      errors.dependents = 'Dependents cannot be negative';
    }

    const healthcare = parseFloat(formData.healthcare);
    if (!formData.healthcare || isNaN(healthcare)) {
      errors.healthcare = 'Healthcare expenses are required';
    } else if (healthcare < 0) {
      errors.healthcare = 'Healthcare expenses cannot be negative';
    }

    const bmi = parseFloat(formData.bmi);
    if (!formData.bmi || isNaN(bmi)) {
      errors.bmi = 'BMI is required';
    } else if (bmi < 15 || bmi > 45) {
      errors.bmi = 'BMI must be between 15 and 45';
    }

    const bloodPressure = parseInt(formData.blood_pressure);
    if (!formData.blood_pressure || isNaN(bloodPressure)) {
      errors.blood_pressure = 'Blood pressure is required';
    } else if (bloodPressure < 80 || bloodPressure > 200) {
      errors.blood_pressure = 'Blood pressure must be between 80 and 200';
    }

    const children = parseInt(formData.children);
    if (isNaN(children)) {
      errors.children = 'Please enter a valid number for children';
    } else if (children < 0) {
      errors.children = 'Children count cannot be negative';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please correct the errors above');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        age: parseInt(formData.age),
        income: parseFloat(formData.income),
        dependents: parseInt(formData.dependents) || 0,
        occupation: formData.occupation,
        city_tier: formData.city_tier,
        healthcare: parseFloat(formData.healthcare),
        bmi: parseFloat(formData.bmi),
        blood_pressure: parseInt(formData.blood_pressure),
        smoker: formData.smoker,
        diabetic: formData.diabetic,
        region: formData.region,
        children: parseInt(formData.children) || 0
      };

      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/predict-insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || errorData.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError('Failed to connect to server. Please ensure all servers are running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'risk-low';
      case 'Medium': return 'risk-medium';
      case 'High': return 'risk-high';
      default: return 'risk-low';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return <Shield className="w-5 h-5" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5" />;
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="insurance-advisor">
      <div className="insurance-container">
        {/* Header */}
        <div className="insurance-header">
          <div className="insurance-icon">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="insurance-title">Insurance Advisor</h1>
          <p className="insurance-subtitle">
            Get personalized insurance recommendations tailored to your financial situation and health profile
          </p>
          <div className="insurance-divider"></div>
        </div>

        <div className="insurance-grid">
          {/* Form Section */}
          <div className="insurance-form-container">
            <form onSubmit={handleSubmit} className="insurance-form">
              
              {/* Financial Information Section */}
              <div className="form-section financial-section">
                <div className="section-header">
                  <div className="section-icon financial-icon">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="section-title">Financial Information</h2>
                    <p className="section-description">Tell us about your financial situation</p>
                  </div>
                </div>
                
                <div className="form-grid">
                  {/* Age Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <User className="w-6 h-6 text-blue-600" />
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`form-input ${fieldErrors.age ? 'error' : ''}`}
                      placeholder="Enter your age"
                      required
                    />
                    {fieldErrors.age && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.age}
                      </div>
                    )}
                  </div>

                  {/* Income Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      Annual Income (₹) *
                    </label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className={`form-input ${fieldErrors.income ? 'error' : ''}`}
                      placeholder="e.g., 800000"
                      required
                    />
                    {fieldErrors.income && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.income}
                      </div>
                    )}
                  </div>

                  {/* Dependents Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Users className="w-6 h-6 text-blue-600" />
                      Number of Dependents
                    </label>
                    <input
                      type="number"
                      name="dependents"
                      value={formData.dependents}
                      onChange={handleInputChange}
                      min="0"
                      className={`form-input ${fieldErrors.dependents ? 'error' : ''}`}
                      placeholder="0"
                    />
                    {fieldErrors.dependents && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.dependents}
                      </div>
                    )}
                  </div>

                  {/* Occupation Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Building className="w-6 h-6 text-blue-600" />
                      Occupation *
                    </label>
                    <select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {occupationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Tier Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      City Tier *
                    </label>
                    <select
                      name="city_tier"
                      value={formData.city_tier}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {cityTierOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Healthcare Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Heart className="w-6 h-6 text-blue-600" />
                      Annual Healthcare Expenses (₹) *
                    </label>
                    <input
                      type="number"
                      name="healthcare"
                      value={formData.healthcare}
                      onChange={handleInputChange}
                      min="0"
                      className={`form-input ${fieldErrors.healthcare ? 'error' : ''}`}
                      placeholder="e.g., 50000"
                      required
                    />
                    {fieldErrors.healthcare && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.healthcare}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Health Information Section */}
              <div className="form-section health-section">
                <div className="section-header">
                  <div className="section-icon health-icon">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="section-title">Health Information</h2>
                    <p className="section-description">Help us assess your health profile</p>
                  </div>
                </div>
                
                <div className="form-grid">
                  {/* BMI Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Activity className="w-6 h-6 text-rose-600" />
                      BMI (Body Mass Index) *
                    </label>
                    <input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      step="0.1"
                      className={`form-input ${fieldErrors.bmi ? 'error' : ''}`}
                      placeholder="e.g., 23.5"
                      required
                    />
                    {fieldErrors.bmi && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.bmi}
                      </div>
                    )}
                  </div>

                  {/* Blood Pressure Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Activity className="w-6 h-6 text-rose-600" />
                      Blood Pressure (Systolic) *
                    </label>
                    <input
                      type="number"
                      name="blood_pressure"
                      value={formData.blood_pressure}
                      onChange={handleInputChange}
                      className={`form-input ${fieldErrors.blood_pressure ? 'error' : ''}`}
                      placeholder="e.g., 120"
                      required
                    />
                    {fieldErrors.blood_pressure && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.blood_pressure}
                      </div>
                    )}
                  </div>

                  {/* Smoker Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Info className="w-6 h-6 text-rose-600" />
                      Smoker *
                    </label>
                    <select
                      name="smoker"
                      value={formData.smoker}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  {/* Diabetic Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Info className="w-6 h-6 text-rose-600" />
                      Diabetic *
                    </label>
                    <select
                      name="diabetic"
                      value={formData.diabetic}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  {/* Region Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <MapPin className="w-6 h-6 text-rose-600" />
                      Region *
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {regionOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Children Field */}
                  <div className="form-field">
                    <label className="form-label">
                      <Users className="w-6 h-6 text-rose-600" />
                      Number of Children
                    </label>
                    <input
                      type="number"
                      name="children"
                      value={formData.children}
                      onChange={handleInputChange}
                      min="0"
                      className={`form-input ${fieldErrors.children ? 'error' : ''}`}
                      placeholder="0"
                    />
                    {fieldErrors.children && (
                      <div className="error-message">
                        <AlertTriangle className="w-5 h-5" />
                        {fieldErrors.children}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Analyzing your profile...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-10 h-10" />
                      <span>Get My Insurance Recommendation</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="error-alert">
                    <div className="error-alert-content">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <p className="error-alert-text">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="results-container">
            {prediction ? (
              <div className="results-content">
                {/* Header */}
                <div className="results-header">
                  <div className="results-icon">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="results-title">Your Insurance Plan</h2>
                  <p className="results-description">Personalized recommendations based on your profile</p>
                </div>
                
                {/* Key Metrics Cards */}
                <div className="metrics-grid">
                  <div className="metric-card budget-card">
                    <div className="metric-content">
                      <div>
                        <p className="metric-label">Recommended Budget</p>
                        <p className="metric-value">
                          ₹{prediction.prediction_summary.recommended_insurance_budget.toLocaleString('en-IN')}
                        </p>
                        <p className="metric-unit">Annual premium</p>
                      </div>
                      <Calculator className="metric-icon" />
                    </div>
                  </div>

                  <div className={`metric-card risk-card ${getRiskClass(prediction.prediction_summary.claim_risk_level)}`}>
                    <div className="metric-content">
                      <div>
                        <p className="metric-label">Claim Risk Level</p>
                        <p className="metric-value">
                          {getRiskIcon(prediction.prediction_summary.claim_risk_level)}
                          {prediction.prediction_summary.claim_risk_level}
                        </p>
                        <p className="metric-unit">Based on health profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card allocation-card">
                    <div className="metric-content">
                      <div>
                        <p className="metric-label">Suggested Allocation</p>
                        <p className="metric-value">
                          {prediction.prediction_summary.suggested_allocation_percentage}%
                        </p>
                        <p className="metric-unit">Of your income</p>
                      </div>
                      <PieChart className="metric-icon" />
                    </div>
                  </div>

                  <div className="metric-card premium-card">
                    <div className="metric-content">
                      <div>
                        <p className="metric-label">Monthly Premium</p>
                        <p className="metric-value">
                          ₹{prediction.prediction_summary.monthly_premium_estimate.toLocaleString('en-IN')}
                        </p>
                        <p className="metric-unit">Per month</p>
                      </div>
                      <DollarSign className="metric-icon" />
                    </div>
                  </div>
                </div>

                {/* Premium Breakdown */}
                <div className="info-section">
                  <div className="info-header">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <h3 className="info-title">Premium Breakdown</h3>
                  </div>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Annual Premium</span>
                      <span className="info-value">{prediction.recommendations.premium_breakdown.annual_premium}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Monthly Premium</span>
                      <span className="info-value">{prediction.recommendations.premium_breakdown.monthly_premium}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Percentage of Income</span>
                      <span className="info-value">{prediction.recommendations.premium_breakdown.percentage_of_income}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="info-section">
                  <div className="info-header">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="info-title">Risk Analysis</h3>
                  </div>
                  <div className="risk-grid">
                    <div className="risk-item">
                      <span className="risk-label">Age Risk</span>
                      <span className={`risk-badge ${prediction.recommendations.risk_analysis.risk_factors.age_risk === 'High' ? 'high' : 'low'}`}>
                        {prediction.recommendations.risk_analysis.risk_factors.age_risk}
                      </span>
                    </div>
                    <div className="risk-item">
                      <span className="risk-label">Lifestyle Risk</span>
                      <span className={`risk-badge ${prediction.recommendations.risk_analysis.risk_factors.lifestyle_risk === 'High' ? 'high' : 'low'}`}>
                        {prediction.recommendations.risk_analysis.risk_factors.lifestyle_risk}
                      </span>
                    </div>
                    <div className="risk-item">
                      <span className="risk-label">Health Risk</span>
                      <span className={`risk-badge ${prediction.recommendations.risk_analysis.risk_factors.health_risk === 'High' ? 'high' : 'low'}`}>
                        {prediction.recommendations.risk_analysis.risk_factors.health_risk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="recommendations-section">
                  <div className="info-header">
                    <Info className="w-6 h-6 text-blue-600" />
                    <h3 className="info-title">Recommendations</h3>
                  </div>
                  <div className="recommendations-list">
                    {prediction.recommendations.suggestions.map((suggestion, index) => (
                      <div key={index} className="recommendation-item">
                        <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="recommendation-text">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="timestamp">
                  Generated on: {prediction.timestamp}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Calculator className="w-14 h-14 text-gray-400" />
                </div>
                <h3 className="empty-title">Ready to Get Started?</h3>
                <p className="empty-description">
                  Fill out the form to receive your personalized insurance recommendation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceAdvisor;
