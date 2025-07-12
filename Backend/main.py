from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from stock import register_stock_routes
from insurance import register_insurance_routes

app = FastAPI(title="Prediction API")

# Enable CORS (allow all for now — secure later!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running successfully 🎉"}

# Register your routes
register_stock_routes(app)
register_insurance_routes(app)
