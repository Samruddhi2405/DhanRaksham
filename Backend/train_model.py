import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Generate dummy stock data
np.random.seed(42)
n_samples = 1000

# Generate features
investment_amount = np.random.uniform(1000, 100000, n_samples)
num_stocks = np.random.randint(1, 50, n_samples)
risk_levels = np.random.choice(['Low', 'Medium', 'High'], n_samples)

# Convert risk levels to numerical values
risk_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
risk_numerical = np.array([risk_mapping[risk] for risk in risk_levels])

# Generate target variable (stock returns)
# More complex relationship with some noise
base_return = 0.1  # 10% base return
risk_multiplier = np.array([1.0, 1.5, 2.0])[risk_numerical]
amount_factor = investment_amount / 100000  # Normalize amount
stocks_factor = num_stocks / 25  # Normalize number of stocks

# Calculate returns with some noise
returns = (base_return * risk_multiplier * (1 + amount_factor) * (1 + stocks_factor) + 
          np.random.normal(0, 0.02, n_samples))

# Create DataFrame
data = pd.DataFrame({
    'investment_amount': investment_amount,
    'num_stocks': num_stocks,
    'risk_level': risk_numerical,
    'returns': returns
})

# Prepare features and target
X = data[['investment_amount', 'num_stocks', 'risk_level']]
y = data['returns']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Save model and scaler
joblib.dump(model, 'Backend/models/stock_model.pkl')
joblib.dump(scaler, 'Backend/models/scaler.pkl')

# Print model performance
train_score = model.score(X_train_scaled, y_train)
test_score = model.score(X_test_scaled, y_test)
print(f"Training R² score: {train_score:.4f}")
print(f"Testing R² score: {test_score:.4f}") 