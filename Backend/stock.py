from fastapi import HTTPException
from pydantic import BaseModel
from typing import Literal
import joblib
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load your model & scaler at import
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, 'models', 'stock_model.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'models', 'scaler.pkl'))

class StockPredictionInput(BaseModel):
    investment_amount: float
    num_stocks: int
    risk_level: Literal["Low", "Medium", "High"]

def register_stock_routes(app):
    @app.post("/predict-stock")
    async def predict_stock(input_data: StockPredictionInput):
        try:
            risk_ranges = {
                "Low": (0.06, 0.10),
                "Medium": (0.10, 0.15),
                "High": (0.15, 0.25),
            }
            min_return, max_return = risk_ranges[input_data.risk_level]
            risk_mapping = {"Low": 0, "Medium": 1, "High": 2}
            risk_numerical = risk_mapping[input_data.risk_level]

            features = np.array([[input_data.investment_amount, input_data.num_stocks, risk_numerical]])
            scaled = scaler.transform(features)
            raw_prediction = model.predict(scaled)[0]
            prediction = max(min_return, min(max_return, raw_prediction))
            expected_return = input_data.investment_amount * (1 + prediction)
            profit = expected_return - input_data.investment_amount

            return {
                "status": "success",
                "prediction": float(prediction),
                "expected_return": round(expected_return, 2),
                "profit": round(profit, 2)
            }

        except Exception as e:
            logger.error(f"Stock prediction failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
