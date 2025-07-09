import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Load data
df = pd.read_csv("data.csv")

# Data Cleaning
print("Missing values before:", df.isnull().sum().sum())
df.dropna(inplace=True)
print("Missing values after:", df.isnull().sum().sum())

# Feature Engineering
df['Savings_Ratio'] = df['Desired_Savings'] / df['Income']
df['Expense_Ratio'] = (df['Groceries'] + df['Transport'] + df['Eating_Out'] + 
                       df['Entertainment'] + df['Utilities'] + df['Healthcare'] + 
                       df['Education'] + df['Miscellaneous']) / df['Income']

# Separate features and target
X = df.drop(columns=['Insurance'])
y = df['Insurance']

# Identify column types
categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
numeric_cols = X.select_dtypes(include=['number']).columns.tolist()

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
    ])

# Full pipeline with model
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(random_state=42))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Hyperparameter tuning
param_grid = {
    'regressor__n_estimators': [200, 300, 400],
    'regressor__max_depth': [10, 20, 30, None],
    'regressor__min_samples_split': [2, 5, 10],
    'regressor__min_samples_leaf': [1, 2, 4],
    'regressor__max_features': ['sqrt', 'log2'],
    'regressor__bootstrap': [True, False]
}

search = RandomizedSearchCV(
    pipeline, 
    param_grid, 
    n_iter=20,
    cv=3,
    verbose=2,
    n_jobs=-1,
    scoring='neg_mean_absolute_error',
    random_state=42
)

search.fit(X_train, y_train)

# Best model
best_model = search.best_estimator_
print("\nBest Parameters:", search.best_params_)

# Evaluation
y_pred = best_model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"\nMAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R2: {r2:.4f}")

# Feature Importance
feature_names = (numeric_cols + 
                list(best_model.named_steps['preprocessor']
                    .named_transformers_['cat']
                    .get_feature_names_out(categorical_cols)))

importances = best_model.named_steps['regressor'].feature_importances_
sorted_idx = np.argsort(importances)[-15:]  # Top 15 features

plt.figure(figsize=(10, 6))
plt.barh(range(len(sorted_idx)), importances[sorted_idx])
plt.yticks(range(len(sorted_idx)), [feature_names[i] for i in sorted_idx])
plt.xlabel("Random Forest Feature Importance")
plt.title("Top 15 Important Features")
plt.tight_layout()
plt.savefig('feature_importance.png')
plt.show()

# Residual Analysis
residuals = y_test - y_pred
plt.figure(figsize=(10, 6))
sns.scatterplot(x=y_pred, y=residuals)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel("Predicted Values")
plt.ylabel("Residuals")
plt.title("Residual Plot")
plt.savefig('residual_plot.png')
plt.show()

# Save model


# Example prediction
sample_data = X.iloc[[0]]  # First row as example
prediction = best_model.predict(sample_data)
print(f"\nExample Prediction: ${prediction[0]:.2f} (Actual: ${y.iloc[0]:.2f})")