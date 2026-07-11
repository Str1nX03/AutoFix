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

## Date: July 09, 2026

### 1. RAG Accuracy Improvements
* Dropped the unreliable Hugging Face cross-encoder reranker.
* Implemented **Dynamic Margin Thresholding** in `rag_retriever.py` to only accept candidates within a strict `0.08` cosine distance of the absolute best semantic match.
* Implemented **Heuristic Type Filtering** to guarantee pinpoint accurate matching for exact product queries (e.g. asking for "CPU" strictly filters out anything that is not a CPU).

## Date: July 11, 2026

### 1. Agent RAG Integration
* Deprecated and deleted the `mock_products.csv` file from the agent directory.
* Refactored `_retrieve_product_info` inside `support_agent.py` to be an asynchronous node.
* Connected the agent's product retrieval node directly to the `search_products(query)` Postgres vector database function, passing the raw user query for highly accurate semantic matching.
* Upgraded the LangGraph execution flow by implementing an asynchronous `arun()` method.
* Replaced hardcoded relative paths for dotenv loading across `database/db.py`, `database/rag_retriever.py`, and `database/utils.py` with dynamic absolute paths, fixing cross-directory path resolution errors during notebook testing.

### 2. Environment & Config Refactoring
* Removed hardcoded API secrets from `agents_src/agent/research.ipynb` and replaced them with dynamic `python-dotenv` variables to resolve GitHub Push Protection blocks.
* Centralized all project secrets into a single, unified `.env` file at the root directory by merging `database/.env` and `.env_example`.
* Updated `database/db.py`, `database/rag_retriever.py`, and `database/utils.py` to target the root `.env` file, enabling secure execution from any directory.
