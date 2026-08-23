import sys
from pathlib import Path

# Allow `py app/main.py` from backend/ without -m flag (fix ModuleNotFoundError: No module named 'app')
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.core.config import settings
from app.api.v1 import api_router

app = FastAPI(
    title="Recsta API",
    description="FastAPI backend for Recsta - profiles, genres, friends, movies. Uses Supabase Postgres + Auth (Google Sign-In via supabase.auth).",
    version="1.0.0",
)

# CORS - allow Expo app. In production, restrict to your domains.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.cors_origins == "*" else [o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "name": "Recsta API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
        "db_health": "/api/v1/health/db",
    }

# For `python -m app.main` convenience
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
