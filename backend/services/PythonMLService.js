const axios = require('axios');

const baseURL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL,
  timeout: 60000,
});

class PythonMLService {
  static async health() {
    const { data } = await client.get('/health');
    return data;
  }

  static async trainClassifier(texts, labels) {
    const { data } = await client.post('/ml/classifier/train', { texts, labels });
    return data;
  }

  static async predictClassifier(text) {
    const { data } = await client.post('/ml/classifier/predict', { text });
    return data;
  }

  static async similarity(query, candidates, topK = 3) {
    const { data } = await client.post('/ml/similarity', {
      query,
      candidates,
      top_k: topK,
    });
    return data;
  }

  static async sentiment(text) {
    const { data } = await client.post('/dl/sentiment', { text });
    return data;
  }

  static async embedding(text) {
    const { data } = await client.post('/dl/embedding', { text });
    return data;
  }

  static async embeddings(texts) {
    const { data } = await client.post('/dl/embeddings', { texts });
    return data;
  }

  static async semanticSearch(query, candidates, topK = 3) {
    const { data } = await client.post('/dl/semantic-search', {
      query,
      candidates,
      top_k: topK,
    });
    return data;
  }
}

module.exports = PythonMLService;
