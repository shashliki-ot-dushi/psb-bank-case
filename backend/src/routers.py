from os import environ
from typing import Dict, Any
import requests
import numpy as np
import pandas as pd
from fastapi import FastAPI, APIRouter, Query, HTTPException
from fastapi.responses import PlainTextResponse
from catboost import CatBoostClassifier
import shap

from schemas import AnalyzeResponse, Verdict, ChatResponse
from company import CompanyStatsFromLocal, CompanyNotFoundError
from llm_request import query_yandex

app = FastAPI(
    title="Company Analysis & LLM Chat API",
    version="1.0.0",
    openapi_tags=[
        {"name": "Financial Analysis", "description": "Анализ вероятности дефолта и влияющих факторов"},
        {"name": "Company statistics", "description": "Статистика по категориям для заданного ИНН"},
    ],
)

# Конфигурация YandexGPT
BASE_URL = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

API_KEY = environ.get("YANDEX_CLOUD_API_KEY")
if not API_KEY:
    raise KeyError("Environment variable YANDEX_CLOUD_API_KEY not specified")

FOLDER_ID = environ.get("YANDEX_CLOUD_FOLDER_ID")
if not FOLDER_ID:
    raise KeyError("Environment variable YANDEX_CLOUD_FOLDER_ID not specified")

# Инициализация источника данных и модели
stats_source = CompanyStatsFromLocal("../data/full_transformed_wo_target.csv")

credit_model = CatBoostClassifier()
credit_model.load_model("../models/catboost_model-2.cbm")

explainer = shap.TreeExplainer(credit_model)

# Роутеры
root = APIRouter(prefix="/v1", tags=["Financial Analysis"])
stats = APIRouter(prefix="/v1/stats", tags=["Company statistics"])


def expect_not_found(func, inn: str):
    try:
        return func(inn)
    except CompanyNotFoundError:
        raise HTTPException(status_code=404, detail=f"Компания с ИНН {inn} не найдена")


@root.get(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Анализ компании"
)
async def analyze_company(
    inn: str = Query(..., description="ИНН компании")
):
    # Получаем строку с данными или 404
    row = expect_not_found(stats_source.get_row, inn)

    # Подготавливаем фичи
    X = row.to_frame().T.reset_index(drop=True)

    # 1. Предсказываем вероятность default
    p_quasi_default = credit_model.predict_proba(X)[0][1]
    verdict = Verdict.decline if p_quasi_default >= 0.3 else Verdict.approve

    # 2. Вычисляем SHAP-значения
    shap_vals = explainer.shap_values(X)
    shap_full = shap_vals[1] if isinstance(shap_vals, list) else shap_vals

    # 3. Убираем колонку 'id', если есть
    if 'id' in X.columns:
        idx = X.columns.get_loc('id')
        features = X.drop(columns=['id'])
        shap_feats = np.delete(shap_full, idx, axis=1)
    else:
        features = X
        shap_feats = shap_full

    # 4. Берём единственную строку shap-значений и формируем ключевых влияющих
    shap_single = shap_feats[0]
    key_influencers = [
        {feat: float(val) for feat, val in zip(features.columns, shap_single)}
    ]

    return AnalyzeResponse(
        verdict=verdict,
        score=float(p_quasi_default),
        key_influencers=key_influencers
    )


@root.get(
    "/chat",
    response_model=ChatResponse,
    summary="LLM Chat — отправить текст и получить ответ"
)
async def chat_llm(
    text: str = Query(..., description="Текст запроса для LLM"),
    api_key: str = Query(..., description="API-ключ Yandex Cloud", example=API_KEY),
    folder_id: str = Query(..., description="ID папки в Yandex Cloud", example=FOLDER_ID),
) -> ChatResponse:
    """
    Отправляет `text` в YandexGPT и возвращает ответ модели.
    """
    try:
        answer = query_yandex(text, api_key=api_key, folder_id=folder_id)
    except requests.HTTPError as http_err:
        status = http_err.response.status_code
        detail = http_err.response.text or http_err.response.reason
        raise HTTPException(status_code=status, detail=f"YandexGPT error: {detail}")
    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=f"Не удалось получить ответ от LLM: {err}"
        )


    return ChatResponse(answer=answer)


# Эндпоинты статистики по категориям
@stats.get("/financial", summary="Финансовые метрики")
async def financial(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_financial_stats, inn)

# Эндпоинты статистики по категориям
@stats.get("/financial", summary="Финансовые метрики")
async def financial(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_financial_stats, inn)
  

@stats.get("/general", summary="Общие метрики")
async def general(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_general_stats, inn)


@stats.get("/general", summary="Общие метрики")
async def general(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_general_stats, inn)


@stats.get("/contracts", summary="Контрактные метрики")
async def contracts(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_contracts_stats, inn)


@stats.get("/contracts", summary="Контрактные метрики")
async def contracts(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_contracts_stats, inn)


@stats.get("/arbitration", summary="Арбитражные метрики")
async def arbitration(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_arbitration_stats, inn)


@stats.get("/arbitration", summary="Арбитражные метрики")
async def arbitration(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_arbitration_stats, inn)


@stats.get("/enforcement", summary="Исполнительные метрики")
async def enforcement(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_enforcement_stats, inn)


@stats.get("/enforcement", summary="Исполнительные метрики")
async def enforcement(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_enforcement_stats, inn)


@stats.get("/risk", summary="Риск-метрики")
async def risk(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_risk_stats, inn)


@stats.get("/all", summary="Все метрики")
async def all_stats(
    inn: str = Query(..., description="ИНН компании")
):
    return expect_not_found(stats_source.get_all_stats, inn)


# Регистрируем роутеры в приложении
app.include_router(root)
app.include_router(stats)
