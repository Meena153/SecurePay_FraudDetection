from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from typing import Optional

app = FastAPI()

import os

# Get the script's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "fraud_test_model.pkl")

# Load trained model
try:
    print(f"DEBUG: Python working directory: {os.getcwd()}")
    print(f"DEBUG: Looking for model at: {MODEL_PATH}")
    
    if os.path.exists(MODEL_PATH):
        file_size = os.path.getsize(MODEL_PATH)
        print(f"DEBUG: Model file found! Size: {file_size} bytes")
        
        # Load the model
        model = joblib.load(MODEL_PATH)
        print("✅ SUCCESS: ML Model loaded successfully!")
    else:
        print(f"❌ CRITICAL: Model file NOT FOUND at: {MODEL_PATH}")
        model = None
except Exception as e:
    print(f"❌ ERROR: Exception during model load: {e}")
    model = None

@app.get("/health")
def health():
    return {
        "status": "online",
        "model_loaded": model is not None,
        "base_dir": BASE_DIR,
        "model_path": MODEL_PATH,
        "file_exists": os.path.exists(MODEL_PATH)
    }

# Define request structure for validation and better IDE support
class Transaction(BaseModel):
    amt: float
    category: int
    merchant: int
    gender: int
    city: int
    state: int
    zip: int
    lat: float
    lon: float
    city_pop: int
    job: int
    transaction_hour: int
    transaction_day: int
    transaction_month: int
    unix_time: int
    merch_lat: float
    merch_long: float

@app.get("/")
def home():
    return {"message": "Fraud Detection API Running"}

@app.post("/predict")
def predict(transaction: Transaction):
    """
    Predicts if a transaction is fraudulent based on its features.
    """
    if model is None:
        return {"prediction": "ERROR", "message": "ML Model not loaded on server."}
        
    try:
        # Convert Pydantic model to dictionary, then to DataFrame
        transaction_dict = transaction.model_dump()
        data = pd.DataFrame([transaction_dict])
        
        # Get columns used when the model was trained
        # This is a dynamic attribute from scikit-learn
        model_features = getattr(model, "feature_names_in_", None)
        
        if model_features is not None:
            # Ensure all required features are present
            for col in model_features:
                if col not in data:
                    data[col] = 0
            # Ensure correct order
            data = data[model_features]
        
        # Predict
        prediction = model.predict(data)[0]
        
        return {
            "prediction": "Fraud" if prediction == 1 else "Safe",
            "fraudScore": 85 if prediction == 1 else 10
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"prediction": "ERROR", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    # Make sure port 8000 is free before running
    uvicorn.run(app, host="0.0.0.0", port=8000)