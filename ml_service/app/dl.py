from __future__ import annotations

from typing import List, Dict

import numpy as np
from transformers import pipeline
from sentence_transformers import SentenceTransformer


# Lazy-loaded globals to keep startup fast.
_sentiment_pipeline = None
_embedding_model = None


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            truncation=True,
        )
    return _sentiment_pipeline


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


def analyze_sentiment(text: str) -> Dict[str, object]:
    pipe = get_sentiment_pipeline()
    result = pipe(text)[0]
    return {
        "label": result["label"],
        "score": float(result["score"]),
    }


def embed_text(text: str) -> Dict[str, object]:
    model = get_embedding_model()
    vector = model.encode([text], normalize_embeddings=True)[0]
    return {
        "dimension": int(len(vector)),
        "embedding": vector.astype(float).tolist(),
    }


def embed_texts(texts: List[str]) -> Dict[str, object]:
    model = get_embedding_model()
    vectors = model.encode(texts, normalize_embeddings=True)
    return {
        "count": len(texts),
        "dimension": int(vectors.shape[1]),
        "embeddings": vectors.astype(float).tolist(),
    }


def semantic_search(query: str, candidates: List[str], top_k: int = 3):
    model = get_embedding_model()
    emb = model.encode([query] + candidates, normalize_embeddings=True)

    query_vec = emb[0]
    candidate_vecs = emb[1:]
    sims = np.dot(candidate_vecs, query_vec)

    ranked = sorted(
        [
            {"index": idx, "text": candidates[idx], "score": float(score)}
            for idx, score in enumerate(sims)
        ],
        key=lambda x: x["score"],
        reverse=True,
    )

    return ranked[: max(1, min(top_k, len(candidates)))]
