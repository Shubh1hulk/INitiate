from __future__ import annotations

from pathlib import Path
from typing import List, Dict

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import cosine_similarity


MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
CLASSIFIER_PATH = MODEL_DIR / "text_classifier.joblib"


def train_text_classifier(texts: List[str], labels: List[str]) -> Dict[str, object]:
    if len(texts) != len(labels):
        raise ValueError("texts and labels must have the same length")

    pipeline = Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=10000)),
            ("clf", LogisticRegression(max_iter=300)),
        ]
    )

    pipeline.fit(texts, labels)
    joblib.dump(pipeline, CLASSIFIER_PATH)

    return {
        "status": "trained",
        "samples": len(texts),
        "labels": sorted(list(set(labels))),
        "model_path": str(CLASSIFIER_PATH),
    }


def predict_text_classifier(text: str) -> Dict[str, object]:
    if not CLASSIFIER_PATH.exists():
        raise FileNotFoundError("Classifier model not trained yet")

    pipeline = joblib.load(CLASSIFIER_PATH)
    pred = pipeline.predict([text])[0]
    probs = pipeline.predict_proba([text])[0]
    classes = pipeline.classes_

    class_scores = [
        {"label": cls, "score": float(score)}
        for cls, score in sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
    ]

    return {
        "prediction": pred,
        "scores": class_scores,
    }


def rank_by_similarity(query: str, candidates: List[str], top_k: int = 3):
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=10000)
    matrix = vectorizer.fit_transform([query] + candidates)
    query_vec = matrix[0]
    candidate_vecs = matrix[1:]

    scores = cosine_similarity(query_vec, candidate_vecs).flatten()
    ranked = sorted(
        [
            {"index": idx, "text": candidates[idx], "score": float(score)}
            for idx, score in enumerate(scores)
        ],
        key=lambda x: x["score"],
        reverse=True,
    )

    return ranked[: max(1, min(top_k, len(candidates)))]
