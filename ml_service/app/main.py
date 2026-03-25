from fastapi import FastAPI, HTTPException

from app.schemas import TextRequest, BatchTextRequest, TrainClassifierRequest, SimilarityRequest
from app.ml import train_text_classifier, predict_text_classifier, rank_by_similarity
from app.dl import analyze_sentiment, embed_text, embed_texts, semantic_search


app = FastAPI(title="LifeTwin ML Service", version="1.0.0")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml_service"}


@app.post("/ml/classifier/train")
def train_classifier(payload: TrainClassifierRequest):
    try:
        return train_text_classifier(payload.texts, payload.labels)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/ml/classifier/predict")
def predict_classifier(payload: TextRequest):
    try:
        return predict_text_classifier(payload.text)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/ml/similarity")
def similarity(payload: SimilarityRequest):
    try:
        return {
            "results": rank_by_similarity(payload.query, payload.candidates, payload.top_k or 3)
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/dl/sentiment")
def sentiment(payload: TextRequest):
    try:
        return analyze_sentiment(payload.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/dl/embedding")
def embedding(payload: TextRequest):
    try:
        return embed_text(payload.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/dl/embeddings")
def embeddings(payload: BatchTextRequest):
    try:
        return embed_texts(payload.texts)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/dl/semantic-search")
def dl_semantic_search(payload: SimilarityRequest):
    try:
        return {
            "results": semantic_search(payload.query, payload.candidates, payload.top_k or 3)
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
