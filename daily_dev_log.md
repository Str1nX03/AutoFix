# AutoFix - Daily Developer Log

## Date: July 08, 2026

### 1. Architectural Changes
* Transitioned vector embeddings generation from Google Gemini (`gemini-embedding-2`) to Hugging Face Serverless Inference API (`BAAI/bge-large-en-v1.5`).
* Implemented a two-stage RAG retrieval pipeline: 
    * **Stage 1**: Fast Cosine Similarity search over PostgreSQL (`pgvector`) returning Top 10 documents.
    * **Stage 2**: Deep cross-encoder reranking using `cross-encoder/ms-marco-MiniLM-L-6-v2` returning Top 3 documents.

### 2. Database Schema Decisions
* Retained the original `Vector(768)` dimension column in the Neon Postgres `products` table.
* Handled the 1024-dimension output from `bge-large-en-v1.5` by programmatically truncating to `[:768]` in Python during the seed process, avoiding expensive schema migrations and potential data loss.

### 3. Code Cleanup
* Deleted redundant `generate_embeddings.py` and integrated its logic directly into `seed_db.py`.
* Deleted `migration.py` as it's no longer necessary.
* Standardized all HTTP requests to utilize `utils.py` with `AsyncInferenceClient`.
