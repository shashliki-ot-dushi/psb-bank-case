from fastapi import APIRouter, Query
from schemas import AnalyzeResponse, FeatureStatsResponse, Verdict, Feautre


root = APIRouter(
    prefix="/api",
    tags=["Financial Analysis"]
)

stats = APIRouter(
    prefix="/api/stats",
    tags=["Curated corporation information"]
)


@root.get("/analyze", response_model=AnalyzeResponse)
async def analyze_company(inn: str = Query(..., description="ИНН компании для анализа")):
    """
    Анализирует финансовую состоятельность компании по ИНН и
    возвращает вердикт о возможности выдачи кредита, а также
    вклад различных факторов в итоговый результат.
    """
    # TODO: Реализовать логику анализа
    return ...


@stats.get(f"/legal", response_model=FeatureStatsResponse)
async def get_arbitration_cases_stats(inn: str = Query(..., description="ИНН компании для анализа арбитражных дел")):
    """
    Возвращает статистику по количеству арбитражных дел компании.
    """
    # TODO: Реализовать логику получения статистики по арбитражным делам
    return ...


@stats.get("/stocks", response_model=FeatureStatsResponse)
async def get_stock_price_trend_stats(inn: str = Query(..., description="ИНН компании для анализа динамики акций")):
    """
    Возвращает статистику по динамике цен на акции компании.
    """
    # TODO: Реализовать логику получения статистики по динамике акций
    return ...


@stats.get("/revenue", response_model=FeatureStatsResponse)
async def get_revenue_growth_stats(inn: str = Query(..., description="ИНН компании для анализа роста выручки")):
    """
    Возвращает статистику по росту выручки компании.
    """
    # TODO: Реализовать логику получения статистики по росту выручки
    return ...


@stats.get("/debt", response_model=FeatureStatsResponse)
async def get_debt_ratio_stats(inn: str = Query(..., description="ИНН компании для анализа долговой нагрузки")):
    """
    Возвращает статистику по уровню долговой нагрузки компании.
    """
    # TODO: Реализовать логику получения статистики по долговой нагрузке
    return ...


@stats.get("/profitability", response_model=FeatureStatsResponse)
async def get_profitability_stats(inn: str = Query(..., description="ИНН компании для анализа прибыльности")):
    """
    Возвращает статистику по прибыльности компании.
    """
    # TODO: Реализовать логику получения статистики по прибыльности
    return ...
