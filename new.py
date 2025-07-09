import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
import joblib

# Load and prepare data
def load_data():
    df = pd.read_csv('insurance.csv')
    
    # Feature engineering
    df['age_bmi'] = df['age'] * df['bmi']
    df['smoker_age'] = df['smoker'].map({'yes':1, 'no':0}) * df['age']
    
    X = df.drop('charges', axis=1)
    y = np.log1p(df['charges'])  # Log transform for skewed target
    return X, y

# Create preprocessing pipeline
def build_preprocessor():
    categorical_cols = ['sex', 'smoker', 'region']
    return ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(), categorical_cols)
        ],
        remainder='passthrough'
    )

# Train model
def train_model(X, y):
    preprocessor = build_preprocessor()
    
    model = GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        subsample=0.8
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    pipeline.fit(X, y)
    return pipeline

# Main execution
if __name__ == '__main__':
    print("Loading data...")
    X, y = load_data()
    
    print("Training model...")
    model_pipeline = train_model(X, y)
    
    print("Saving model...")
    joblib.dump(model_pipeline, 'insurance_predictor.joblib')
    
    print("Model saved successfully as 'insurance_predictor.joblib'")
    print("Model features:", list(X.columns))