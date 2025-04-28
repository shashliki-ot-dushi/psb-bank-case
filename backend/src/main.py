from fastapi import FastAPI
from routers import root, stats

app = FastAPI(
    title="Financial Analysis API",
    description="Сервис для анализа финансовой устойчивости компаний по ИНН",
    version="1.0.0"
)

app.include_router(root)
app.include_router(stats)
