from pydantic import BaseModel, Field
from typing import Dict, Any, List
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
    key_influencers: List[Dict[str, float]]

class ChatResponse(BaseModel):
    answer: str = Field(..., description="Текстовый ответ от LLM")
