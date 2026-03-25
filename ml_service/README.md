# LifeTwin Python ML Service

This service adds machine learning and deep learning features to the LifeTwin stack.

## Features

- ML text classifier (train + predict) using scikit-learn
- TF-IDF cosine similarity ranking
- DL sentiment analysis using transformers
- Semantic embeddings + semantic search using sentence-transformers

## Setup

```bash
cd ml_service
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

```bash
curl http://localhost:8000/health
```
