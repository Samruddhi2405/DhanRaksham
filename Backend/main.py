from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Literal
import logging
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import os
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Prediction API")

# Enable CORS with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
try:
    logger.info("Attempting to load model and scaler...")
    model = joblib.load('Backend/models/stock_model.pkl')
    scaler = joblib.load('Backend/models/scaler.pkl')
    logger.info("Model and scaler loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

class StockPredictionInput(BaseModel):
    investment_amount: float
    num_stocks: int
    risk_level: Literal["Low", "Medium", "High"]

    class Config:
        schema_extra = {
            "example": {
                "investment_amount": 50000,
                "num_stocks": 10,
                "risk_level": "Medium"
            }
        }

@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Stock Prediction API is running"}

@app.post("/predict-stock")
async def predict_stock(input_data: StockPredictionInput):
    try:
        logger.info(f"Received prediction request: {input_data.dict()}")
        
        # Define risk ranges
        risk_ranges = {
            "Low": (0.06, 0.10),      # 6-10%
            "Medium": (0.10, 0.15),   # 10-15%
            "High": (0.15, 0.25),     # 15-25%
        }
        
        # Get the risk range for the input risk level
        min_return, max_return = risk_ranges[input_data.risk_level]
        
        # Convert risk level to numerical value
        risk_mapping = {"Low": 0, "Medium": 1, "High": 2}
        risk_numerical = risk_mapping[input_data.risk_level]

        # Prepare input features
        features = np.array([[
            input_data.investment_amount,
            input_data.num_stocks,
            risk_numerical
        ]])

        # Scale features and make prediction
        features_scaled = scaler.transform(features)
        raw_prediction = model.predict(features_scaled)[0]
        
        # Clamp prediction to risk level range
        prediction = max(min_return, min(max_return, raw_prediction))
        
        expected_return = input_data.investment_amount * (1 + prediction)
        profit = expected_return - input_data.investment_amount

        logger.info(f"Prediction successful: {prediction} (clamped from {raw_prediction} to {input_data.risk_level} range)")
        
        return {
            "status": "success",
            "prediction_summary": {
                "investment_amount": input_data.investment_amount,
                "expected_return": round(expected_return, 2),
                "profit": round(profit, 2),
                "return_rate": round(prediction * 100, 2),
                "return_rate_formatted": f"{round(prediction * 100, 2)}%"
            },
            "investment_details": {
                "principal_amount": input_data.investment_amount,
                "number_of_stocks": input_data.num_stocks,
                "risk_level": input_data.risk_level,
                "average_per_stock": round(input_data.investment_amount / input_data.num_stocks, 2)
            },
            "risk_analysis": {
                "selected_risk": input_data.risk_level,
                "risk_range": f"{min_return*100:.1f}% - {max_return*100:.1f}%",
                "risk_description": {
                    "Low": "Conservative investment with stable returns",
                    "Medium": "Balanced investment with moderate growth potential",
                    "High": "Aggressive investment with high growth potential but higher volatility"
                }[input_data.risk_level]
            },
            "returns_breakdown": {
                "initial_investment": f"₹{input_data.investment_amount:,.2f}",
                "expected_return": f"₹{expected_return:,.2f}",
                "total_profit": f"₹{profit:,.2f}",
                "return_percentage": f"{prediction * 100:.2f}%"
            },
            "prediction": float(prediction),
            "expected_return": float(expected_return),
            "timestamp": logger.info.__self__.handlers[0].formatter.formatTime(logging.LogRecord(
                name="", level=0, pathname="", lineno=0, msg="", args=(), exc_info=None
            )) if logger.info.__self__.handlers else None
        }

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class InsuranceAdvisor:
    def __init__(self):
        self.insurance_amount_model = None
        self.claim_risk_model = None
        self.affordability_model = None
        self.scalers = {}
        self.label_encoders = {}
        
    def prepare_financial_data(self, df):
        """Prepare financial data for insurance amount prediction"""
        # Encode categorical variables
        categorical_cols = ['occupation', 'city_tier']
        for col in categorical_cols:
            if col in df.columns:
                le = LabelEncoder()
                df[f'{col}_encoded'] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        # Select features for insurance amount prediction
        feature_cols = ['age', 'income', 'dependents', 'occupation_encoded', 'city_tier_encoded', 'healthcare']
        return df[feature_cols].fillna(0)
    
    def prepare_health_data(self, df):
        """Prepare health data for claim risk prediction"""
        # Encode categorical variables
        categorical_cols = ['smoker', 'diabetic', 'region']
        for col in categorical_cols:
            if col in df.columns:
                le = LabelEncoder()
                df[f'{col}_encoded'] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        # Select features for claim risk prediction
        feature_cols = ['age', 'bmi', 'blood_pressure', 'smoker_encoded', 'diabetic_encoded', 'region_encoded', 'children']
        return df[feature_cols].fillna(0)
    
    def create_synthetic_data(self):
        """Create synthetic data for demonstration (replace with real data loading)"""
        np.random.seed(42)
        n_samples = 1000
        
        # Financial data
        financial_data = pd.DataFrame({
            'age': np.random.randint(18, 70, n_samples),
            'income': np.random.normal(500000, 200000, n_samples).clip(100000, 2000000),
            'dependents': np.random.randint(0, 6, n_samples),
            'occupation': np.random.choice(['engineer', 'doctor', 'teacher', 'business', 'govt'], n_samples),
            'city_tier': np.random.choice(['tier1', 'tier2', 'tier3'], n_samples),
            'healthcare': np.random.normal(50000, 20000, n_samples).clip(10000, 200000)
        })
        
        # Create target: ideal insurance amount (10-15% of income based on risk factors)
        financial_data['ideal_insurance'] = (
            financial_data['income'] * (0.10 + 0.05 * financial_data['dependents'] / 5) +
            np.random.normal(0, 10000, n_samples)
        ).clip(50000, 500000)
        
        # Health data  
        health_data = pd.DataFrame({
            'age': np.random.randint(18, 70, n_samples),
            'bmi': np.random.normal(25, 5, n_samples).clip(15, 45),
            'blood_pressure': np.random.randint(80, 180, n_samples),
            'smoker': np.random.choice(['yes', 'no'], n_samples, p=[0.3, 0.7]),
            'diabetic': np.random.choice(['yes', 'no'], n_samples, p=[0.2, 0.8]),
            'region': np.random.choice(['north', 'south', 'east', 'west'], n_samples),
            'children': np.random.randint(0, 5, n_samples)
        })
        
        # Create target: claim risk (based on health factors)
        risk_score = (
            (health_data['age'] > 50).astype(int) * 0.3 +
            (health_data['bmi'] > 30).astype(int) * 0.2 +
            (health_data['blood_pressure'] > 140).astype(int) * 0.2 +
            (health_data['smoker'] == 'yes').astype(int) * 0.3 +
            np.random.normal(0, 0.1, n_samples)
        )
        
        health_data['claim_risk'] = pd.cut(risk_score, 
                                          bins=[-np.inf, 0.3, 0.7, np.inf], 
                                          labels=['Low', 'Medium', 'High'])
        
        return financial_data, health_data
    
    def train_models(self):
        """Train all models"""
        print("Creating synthetic data...")
        financial_data, health_data = self.create_synthetic_data()
        
        # Train insurance amount model
        print("Training insurance amount prediction model...")
        X_financial = self.prepare_financial_data(financial_data.copy())
        y_insurance = financial_data['ideal_insurance']
        
        self.insurance_amount_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.insurance_amount_model.fit(X_financial, y_insurance)
        
        # Train claim risk model
        print("Training claim risk prediction model...")
        X_health = self.prepare_health_data(health_data.copy())
        y_risk = health_data['claim_risk']
        
        self.claim_risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.claim_risk_model.fit(X_health, y_risk)
        
        # Train affordability model (optional clustering)
        print("Training affordability clustering model...")
        income_family_data = financial_data[['income', 'dependents']].copy()
        scaler = StandardScaler()
        income_family_scaled = scaler.fit_transform(income_family_data)
        
        self.affordability_model = KMeans(n_clusters=3, random_state=42)
        self.affordability_model.fit(income_family_scaled)
        self.scalers['affordability'] = scaler
        
        # Save models
        self.save_models()
        print("Models trained and saved successfully!")
    
    def save_models(self):
        """Save all trained models"""
        models_dir = 'models'
        os.makedirs(models_dir, exist_ok=True)
        
        joblib.dump(self.insurance_amount_model, f'{models_dir}/insurance_amount_model.joblib')
        joblib.dump(self.claim_risk_model, f'{models_dir}/claim_risk_model.joblib')
        joblib.dump(self.affordability_model, f'{models_dir}/affordability_model.joblib')
        joblib.dump(self.label_encoders, f'{models_dir}/label_encoders.joblib')
        joblib.dump(self.scalers, f'{models_dir}/scalers.joblib')
    
    def load_models(self):
        """Load pre-trained models"""
        models_dir = 'models'
        
        if not os.path.exists(f'{models_dir}/insurance_amount_model.joblib'):
            print("Models not found. Training new models...")
            self.train_models()
            return
        
        self.insurance_amount_model = joblib.load(f'{models_dir}/insurance_amount_model.joblib')
        self.claim_risk_model = joblib.load(f'{models_dir}/claim_risk_model.joblib')
        self.affordability_model = joblib.load(f'{models_dir}/affordability_model.joblib')
        self.label_encoders = joblib.load(f'{models_dir}/label_encoders.joblib')
        self.scalers = joblib.load(f'{models_dir}/scalers.joblib')
        print("Models loaded successfully!")
    
    def predict(self, input_file='input.csv', output_file='output.csv'):
        """Make predictions on input data"""
        # Load models
        self.load_models()
        
        # Read input data
        if not os.path.exists(input_file):
            print(f"Input file {input_file} not found!")
            return
        
        df = pd.read_csv(input_file)
        results = []
        
        for idx, row in df.iterrows():
            # Prepare data for predictions
            financial_input = pd.DataFrame([{
                'age': row['age'],
                'income': row['income'],
                'dependents': row['dependents'],
                'occupation': row['occupation'],
                'city_tier': row['city_tier'],
                'healthcare': row['healthcare']
            }])
            
            health_input = pd.DataFrame([{
                'age': row['age'],
                'bmi': row['bmi'],
                'blood_pressure': row['blood_pressure'],
                'smoker': row['smoker'],
                'diabetic': row['diabetic'],
                'region': row['region'],
                'children': row['children']
            }])
            
            # Encode and prepare features
            financial_features = self.prepare_financial_data(financial_input.copy())
            health_features = self.prepare_health_data(health_input.copy())
            
            # Make predictions
            insurance_amount = self.insurance_amount_model.predict(financial_features)[0]
            claim_risk = self.claim_risk_model.predict(health_features)[0]
            
            # Calculate affordability percentage
            affordability_input = [[row['income'], row['dependents']]]
            affordability_scaled = self.scalers['affordability'].transform(affordability_input)
            affordability_cluster = self.affordability_model.predict(affordability_scaled)[0]
            
            # Map cluster to percentage (you can adjust these based on your business logic)
            affordability_percentages = {0: 8, 1: 12, 2: 15}  # Low, Medium, High affordability
            affordability_percentage = affordability_percentages.get(affordability_cluster, 10)
            
            results.append({
                'user_id': idx + 1,
                'recommended_insurance_budget': round(insurance_amount, 2),
                'claim_risk_level': claim_risk,
                'suggested_allocation_percentage': affordability_percentage,
                'monthly_premium_estimate': round(insurance_amount / 12, 2),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
        
        # Save results
        results_df = pd.DataFrame(results)
        results_df.to_csv(output_file, index=False)
        print(f"Predictions saved to {output_file}")

class InsurancePredictionInput(BaseModel):
    age: int
    income: float
    dependents: int
    occupation: str
    city_tier: str
    healthcare: float
    bmi: float
    blood_pressure: int
    smoker: str
    diabetic: str
    region: str
    children: int

    class Config:
        schema_extra = {
            "example": {
                "age": 35,
                "income": 800000,
                "dependents": 2,
                "occupation": "engineer",
                "city_tier": "tier1",
                "healthcare": 50000,
                "bmi": 23.5,
                "blood_pressure": 120,
                "smoker": "no",
                "diabetic": "no",
                "region": "north",
                "children": 2
            }
        }

# Initialize insurance advisor (global instance)
insurance_advisor = InsuranceAdvisor()

@app.post("/predict-insurance")
async def predict_insurance(input_data: InsurancePredictionInput):
    try:
        logger.info(f"Received insurance prediction request: {input_data.dict()}")
        
        # Load models if not already loaded
        if insurance_advisor.insurance_amount_model is None:
            insurance_advisor.load_models()
        
        # Prepare financial data
        financial_input = pd.DataFrame([{
            'age': input_data.age,
            'income': input_data.income,
            'dependents': input_data.dependents,
            'occupation': input_data.occupation,
            'city_tier': input_data.city_tier,
            'healthcare': input_data.healthcare
        }])
        
        # Prepare health data
        health_input = pd.DataFrame([{
            'age': input_data.age,
            'bmi': input_data.bmi,
            'blood_pressure': input_data.blood_pressure,
            'smoker': input_data.smoker,
            'diabetic': input_data.diabetic,
            'region': input_data.region,
            'children': input_data.children
        }])
        
        # Encode and prepare features
        financial_features = insurance_advisor.prepare_financial_data(financial_input.copy())
        health_features = insurance_advisor.prepare_health_data(health_input.copy())
        
        # Make predictions
        insurance_amount = insurance_advisor.insurance_amount_model.predict(financial_features)[0]
        claim_risk = insurance_advisor.claim_risk_model.predict(health_features)[0]
        
        # Calculate affordability percentage
        affordability_input = [[input_data.income, input_data.dependents]]
        affordability_scaled = insurance_advisor.scalers['affordability'].transform(affordability_input)
        affordability_cluster = insurance_advisor.affordability_model.predict(affordability_scaled)[0]
        
        # Map cluster to percentage
        affordability_percentages = {0: 8, 1: 12, 2: 15}
        affordability_percentage = affordability_percentages.get(affordability_cluster, 10)
        
        # Calculate additional metrics
        monthly_premium = insurance_amount / 12
        affordability_amount = input_data.income * (affordability_percentage / 100)
        
        logger.info(f"Insurance prediction successful: Amount: {insurance_amount}, Risk: {claim_risk}")
        
        return {
            "status": "success",
            "prediction_summary": {
                "recommended_insurance_budget": round(insurance_amount, 2),
                "claim_risk_level": claim_risk,
                "suggested_allocation_percentage": affordability_percentage,
                "monthly_premium_estimate": round(monthly_premium, 2),
                "affordability_based_amount": round(affordability_amount, 2)
            },
            "user_profile": {
                "age": input_data.age,
                "income": input_data.income,
                "dependents": input_data.dependents,
                "occupation": input_data.occupation.title(),
                "health_factors": {
                    "bmi": input_data.bmi,
                    "smoker": input_data.smoker,
                    "diabetic": input_data.diabetic
                }
            },
            "recommendations": {
                "premium_breakdown": {
                    "annual_premium": f"₹{insurance_amount:,.2f}",
                    "monthly_premium": f"₹{monthly_premium:,.2f}",
                    "percentage_of_income": f"{(insurance_amount/input_data.income)*100:.1f}%"
                },
                "risk_analysis": {
                    "claim_risk": claim_risk,
                    "risk_factors": {
                        "age_risk": "High" if input_data.age > 50 else "Low",
                        "lifestyle_risk": "High" if input_data.smoker == "yes" else "Low",
                        "health_risk": "High" if input_data.diabetic == "yes" or input_data.bmi > 30 else "Low"
                    }
                },
                "suggestions": [
                    f"Consider {claim_risk.lower()} risk insurance plans",
                    f"Allocate {affordability_percentage}% of income to insurance",
                    "Review policy annually for optimal coverage"
                ]
            },
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    except Exception as e:
        logger.error(f"Error during insurance prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """Main function to run the insurance advisor"""
    advisor = InsuranceAdvisor()
    
    # Check if we should train models or just predict
    if len(os.sys.argv) > 1 and os.sys.argv[1] == 'train':
        advisor.train_models()
    else:
        advisor.predict()

if __name__ == "__main__":
    main() 