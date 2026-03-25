from typing import List, Optional
from pydantic import BaseModel, Field


class TextRequest(BaseModel):
    text: str = Field(..., min_length=1)


class BatchTextRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1)


class TrainClassifierRequest(BaseModel):
    texts: List[str] = Field(..., min_length=2)
    labels: List[str] = Field(..., min_length=2)


class SimilarityRequest(BaseModel):
    query: str = Field(..., min_length=1)
    candidates: List[str] = Field(..., min_length=1)
    top_k: Optional[int] = 3
