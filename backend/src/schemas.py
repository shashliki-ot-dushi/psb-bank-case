from pydantic import BaseModel
from typing import Dict
from enum import Enum


class Feature(str, Enum):
    legal = "legal"
    stocks = "stocks"
    revenue = "revenue"
    debt = "debt"
    profitability = "profitability"


class Verdict(str, Enum):
    approve = "approve"
    decline = "decline"


class AnalyzeResponse(BaseModel):
    verdict: Verdict
    key_influencers: Dict[str, float]  # Название фичи -> вклад в результат в процентах
