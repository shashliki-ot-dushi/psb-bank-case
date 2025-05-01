from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import root, stats, raw, load_raw_tables
from database import test_db


# Testing infrastructure
test_db()
load_raw_tables()

app = FastAPI(
    title="Company Analysis & LLM Chat API",
    version="1.0.0",
    openapi_tags=[
        {"name": "Financial Analysis", "description": "Анализ вероятности дефолта и влияющих факторов"},
        {"name": "Company statistics", "description": "Статистика по категориям для заданного ИНН"},
    ],
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(root)
app.include_router(stats)
app.include_router(raw)
