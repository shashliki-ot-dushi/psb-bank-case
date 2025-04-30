from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any

from schemas import AnalyzeResponse, Verdict
from company import CompanyStatsFromLocal, CompanyNotFoundError


stats_source = CompanyStatsFromLocal("../data/company_info.csv")

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
    return AnalyzeResponse(verdict=Verdict.approve, key_influencers={})


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
