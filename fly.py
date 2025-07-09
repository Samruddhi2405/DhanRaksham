import base64
import io
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg')  # Non-GUI backend
import matplotlib.pyplot as plt
import logging
from sklearn.exceptions import InconsistentVersionWarning
import warnings

# Suppress warnings
warnings.simplefilter("ignore", InconsistentVersionWarning)

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the trained model pipeline
try:
    pipeline = joblib.load('insurance_predictor.joblib')
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    pipeline = None

@app.route('/predict_insurance', methods=['POST'])
def predict_insurance():
    try:
        if not pipeline:
            return jsonify({'error': 'Model not loaded', 'message': 'Prediction service unavailable'}), 503

        # Get input data from request
        data = request.json
        
        # Validate required fields
        required_fields = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields', 'message': 'All fields are required'}), 400

        # Create DataFrame from input
        sample = pd.DataFrame({
            'age': [data['age']],
            'sex': [data['sex']],
            'bmi': [data['bmi']],
            'children': [data['children']],
            'smoker': [data['smoker']],
            'region': [data['region']]
        })

        # Add engineered features
        sample['age_bmi'] = sample['age'] * sample['bmi']
        sample['smoker_age'] = sample['smoker'].map({'yes':1, 'no':0}) * sample['age']

        # Make prediction
        predicted_log = pipeline.predict(sample)
        predicted_charge = np.expm1(predicted_log)[0]  # Convert back from log scale

        # Return only the prediction and message
        return jsonify({
            'prediction': round(float(predicted_charge), 2),
            'message': 'Insurance premium prediction successful'
        }), 200

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e), 'message': 'Prediction failed'}), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    try:
        if not pipeline:
            return jsonify({'error': 'Model not loaded'}), 503

        # Get CSV file from request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'Only CSV files are supported'}), 400

        # Read and validate CSV
        df = pd.read_csv(file)
        required_cols = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']
        if not all(col in df.columns for col in required_cols):
            return jsonify({'error': f'CSV must contain columns: {required_cols}'}), 400

        # Add engineered features
        df['age_bmi'] = df['age'] * df['bmi']
        df['smoker_age'] = df['smoker'].map({'yes':1, 'no':0}) * df['age']

        # Make predictions
        predictions_log = pipeline.predict(df)
        df['predicted_charge'] = np.expm1(predictions_log)
        
        # Generate summary statistics
        stats = {
            'mean_prediction': float(df['predicted_charge'].mean()),
            'min_prediction': float(df['predicted_charge'].min()),
            'max_prediction': float(df['predicted_charge'].max()),
            'count': int(len(df))
        }

        # Return results as JSON
        return jsonify({
            'predictions': df.to_dict(orient='records'),
            'statistics': stats,
            'message': 'Batch prediction completed'
        }), 200

    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    if not pipeline:
        return jsonify({'error': 'Model not loaded'}), 503
        
    return jsonify({
        'model_type': 'GradientBoostingRegressor',
        'features': ['age', 'sex', 'bmi', 'children', 'smoker', 'region', 'age_bmi', 'smoker_age'],
        'target': 'log(charges)',
        'version': '1.0'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)