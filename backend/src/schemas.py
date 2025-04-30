from pydantic import BaseModel, Field
from typing import Dict, Any
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
    score: float
    key_influencers: Dict[str, float]