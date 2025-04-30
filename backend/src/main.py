from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import root, stats

app = FastAPI(
    title="Financial Analysis API",
    description="Сервис для анализа финансовой устойчивости компаний по ИНН",
    version="1.0.0"
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
