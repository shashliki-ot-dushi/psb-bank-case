from typing import List, Dict
from pydantic import BaseModel


class InputItem(BaseModel):
    data: str


class InferenceRequest(BaseModel):
    inputs: List[InputItem]


class OutputItem(BaseModel):
    label: str
    score: float
    top20: Dict[str, float]


class InferenceResponse(BaseModel):
    outputs: List[OutputItem]