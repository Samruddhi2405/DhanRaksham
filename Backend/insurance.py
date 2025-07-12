from fastapi import HTTPException
from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class InsuranceAdvisor:
    def __init__(self):
        self.insurance_amount_model = None
        self.claim_risk_model = None
        self.affordability_model = None
        self.label_encoders = {}
        self.scalers = {}
        self.load_models()

    def load_models(self):
        models_dir = "models"
        self.insurance_amount_model = joblib.load(f"{models_dir}/insurance_amount_model.joblib")
        self.claim_risk_model = joblib.load(f"{models_dir}/claim_risk_model.joblib")
        self.affordability_model = joblib.load(f"{models_dir}/affordability_model.joblib")
        self.label_encoders = joblib.load(f"{models_dir}/label_encoders.joblib")
        self.scalers = joblib.load(f"{models_dir}/scalers.joblib")

    def prepare_financial_data(self, df):
        for col in ['occupation', 'city_tier']:
            le = self.label_encoders[col]
            df[f'{col}_encoded'] = le.transform(df[col])
        feature_cols = ['age', 'income', 'dependents', 'occupation_encoded', 'city_tier_encoded', 'healthcare']
        return df[feature_cols]

    def prepare_health_data(self, df):
        for col in ['smoker', 'diabetic', 'region']:
            le = self.label_encoders[col]
            df[f'{col}_encoded'] = le.transform(df[col])
        feature_cols = ['age', 'bmi', 'blood_pressure', 'smoker_encoded', 'diabetic_encoded', 'region_encoded', 'children']
        return df[feature_cols]

insurance_advisor = InsuranceAdvisor()

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

def register_insurance_routes(app: FastAPI):
    @app.post("/predict-insurance")
    async def predict_insurance(input_data: InsurancePredictionInput):
        try:
            financial_input = pd.DataFrame([{
                'age': input_data.age,
                'income': input_data.income,
                'dependents': input_data.dependents,
                'occupation': input_data.occupation,
                'city_tier': input_data.city_tier,
                'healthcare': input_data.healthcare
            }])

            health_input = pd.DataFrame([{
                'age': input_data.age,
                'bmi': input_data.bmi,
                'blood_pressure': input_data.blood_pressure,
                'smoker': input_data.smoker,
                'diabetic': input_data.diabetic,
                'region': input_data.region,
                'children': input_data.children
            }])

            X_financial = insurance_advisor.prepare_financial_data(financial_input)
            X_health = insurance_advisor.prepare_health_data(health_input)

            insurance_amount = insurance_advisor.insurance_amount_model.predict(X_financial)[0]
            claim_risk = insurance_advisor.claim_risk_model.predict(X_health)[0]

            affordability_input = [[input_data.income, input_data.dependents]]
            affordability_scaled = insurance_advisor.scalers['affordability'].transform(affordability_input)
            cluster = insurance_advisor.affordability_model.predict(affordability_scaled)[0]

            perc_map = {0: 8, 1: 12, 2: 15}
            affordability_percentage = perc_map.get(cluster, 10)

            return {
                "status": "success",
                "insurance_amount": round(insurance_amount, 2),
                "claim_risk": claim_risk,
                "affordability_percentage": affordability_percentage,
                "monthly_premium": round(insurance_amount / 12, 2),
                "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }

        except Exception as e:
            logger.error(f"Insurance prediction failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
