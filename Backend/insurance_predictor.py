# insurance_predictor.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os
import sys
from datetime import datetime

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
        """Create synthetic data for demonstration"""
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
            
            # Map cluster to percentage
            affordability_percentages = {0: 8, 1: 12, 2: 15}
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

def main():
    """Main function to run the insurance advisor"""
    advisor = InsuranceAdvisor()
    
    # Check if we should train models or just predict
    if len(sys.argv) > 1 and sys.argv[1] == 'train':
        advisor.train_models()
    else:
        advisor.predict()

if __name__ == "__main__":
    main()