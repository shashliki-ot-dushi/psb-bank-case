from typing import Dict, Any

import numpy as np
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from catboost import CatBoostClassifier
import shap

from schemas import AnalyzeResponse, Verdict
from company import CompanyStatsFromLocal, CompanyNotFoundError


stats_source = CompanyStatsFromLocal("../data/full_transformed_wo_target.csv")

credit_model = CatBoostClassifier()
credit_model.load_model("../models/catboost_model-2.cbm")

explainer = shap.TreeExplainer(credit_model)

root = APIRouter(
    prefix="/v1",
    tags=["Financial Analysis"]
)

stats = APIRouter(
    prefix="/v1/stats", 
    tags=["Company statistics"]
)


def expect_not_found(func, inn: str, cat: str):
    try:
        return func(inn)
    except CompanyNotFoundError:
        raise HTTPException(404, f"Компания с ИНН {inn} не найдена")


@root.get("/analyze", response_model=AnalyzeResponse)
async def analyze_company(inn: str = Query(..., description="ИНН компании")):
    try:
        row = stats_source.get_row(inn)
    except CompanyNotFoundError:
        raise HTTPException(status_code=404, detail=f"Компания с ИНН {inn} не найдена")
    
    # Формируем единственный экземпляр фич
    X = row.to_frame().T.reset_index(drop=True)
    
    # 1. Предскажем вероятность default
    p_quasi_default = credit_model.predict_proba(X)[0][1]
    verdict = Verdict.decline if p_quasi_default >= 0.3 else Verdict.approve

    # 2. Вычисляем SHAP-значения
    shap_vals = explainer.shap_values(X)
    # Для бинарного классификатора shap_vals — список [для класса 0, для класса 1]
    shap_full = shap_vals[1] if isinstance(shap_vals, list) else shap_vals

    # 3. Убираем столбец 'id' (если он есть)
    if 'id' in X.columns:
        id_col_index = X.columns.get_loc('id')
        features = X.drop(columns=['id'])
        shap_feats = np.delete(shap_full, id_col_index, axis=1)
    else:
        features = X
        shap_feats = shap_full

    # 4. Берём единственную строку shap-значений
    shap_single = shap_feats[0]

    # 5. Собираем словарь {feature_name: shap_value}
    key_influencers = [
        {
        feat: float(val)
        for feat, val in zip(features.columns, shap_single)
        },
    ]

    return AnalyzeResponse(
        verdict=verdict,
        score=float(p_quasi_default),
        key_influencers=key_influencers
    )

@stats.get("/financial")
async def financial(inn: str = Query(...)): 
    return expect_not_found(stats_source.get_financial_stats, inn, "financial")


@stats.get("/general")
async def general(inn: str = Query(...)):
    return expect_not_found(stats_source.get_general_stats, inn, "general")


@stats.get("/contracts")
async def contracts(inn: str = Query(...)):
    return expect_not_found(stats_source.get_contracts_stats, inn, "contracts")


@stats.get("/arbitration")
async def arbitration(inn: str = Query(...)):
    return expect_not_found(stats_source.get_arbitration_stats, inn, "arbitration")


@stats.get("/enforcement")
async def enforcement(inn: str = Query(...)):
    return expect_not_found(stats_source.get_enforcement_stats, inn, "enforcement")


@stats.get("/risk")
async def risk(inn: str = Query(...)):
    return expect_not_found(stats_source.get_risk_stats, inn, "risk")


@stats.get("/all")
async def all_stats(inn: str = Query(...)):
    try:
        return stats_source.get_all_stats(inn)
    except CompanyNotFoundError:
        raise HTTPException(404, f"Компания с ИНН {inn} не найдена")
