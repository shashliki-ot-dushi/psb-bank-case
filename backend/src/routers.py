from typing import Dict, Any

import numpy as np
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from catboost import CatBoostClassifier

from schemas import AnalyzeResponse, Verdict
from company import CompanyStatsFromLocal, CompanyNotFoundError


stats_source = CompanyStatsFromLocal("../data/company_info.csv")

credit_model = CatBoostClassifier()
credit_model.load_model("../models/baseline.cbm")

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
async def analyze_company(inn: str = Query(..., description="ИНН компании")) -> AnalyzeResponse:
    try:
        row = stats_source.get_row(inn)
    except CompanyNotFoundError:
        raise HTTPException(404, f"Компания с ИНН {inn} не найдена")

    X = row.to_frame().T

    p_quasi_default = credit_model.predict_proba(X)[0][1]

    verdict = Verdict.decline if p_quasi_default >= 0.3 else Verdict.approve


    feature_names = X.columns.tolist()
    importances = credit_model.get_feature_importance(type='FeatureImportance')

    feat_imp_df = pd.DataFrame({
    'feature': feature_names,
    'importance': importances
})
    
    total_imp = feat_imp_df['importance'].sum()
    feat_imp_df['importance_rel'] = feat_imp_df['importance'] / total_imp

    feat_imp_df = feat_imp_df.sort_values(
        by='importance_rel',
        ascending=False
    ).reset_index(drop=True)

    feat_imp_df = feat_imp_df[['feature', 'importance_rel']]
    key_influencers = dict(zip(feat_imp_df['feature'], feat_imp_df['importance_rel']))

    return AnalyzeResponse(
        verdict=verdict,
        score=p_quasi_default,
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
