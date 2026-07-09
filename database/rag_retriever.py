import asyncio
import os
from huggingface_hub import InferenceClient
from sqlalchemy.future import select
from database.db import AsyncSessionLocal
from database.models import Product
from database.utils import generate_embeddings
from dotenv import load_dotenv

load_dotenv(dotenv_path="database/.env")
HF_TOKEN = os.getenv("HUGGINGFACE_HUB_API_TOKEN")

async def search_products(query: str, top_k: int = 3):
    """Search for products in the database using Hugging Face embeddings and Cross-Encoder reranking."""
    print(f"Searching for: '{query}'")
    
    # 1. Generate the embedding for the user's query
    raw_query_embedding = generate_embeddings(query)
    
    # Truncate to 768 dimensions to match our database column
    if raw_query_embedding and len(raw_query_embedding) >= 768:
        query_embedding = raw_query_embedding[:768]
    else:
        query_embedding = raw_query_embedding
        
    async with AsyncSessionLocal() as session:
        # 2. STAGE 1: Fast Vector Search (Cosine Similarity)
        # Fetch Top 10 candidates from Neon Postgres
        candidate_count = 10
        stmt = (
            select(Product)
            .order_by(Product.embedding.cosine_distance(query_embedding))
            .limit(candidate_count)
        )
        
        result = await session.execute(stmt)
        candidates = result.scalars().all()
        
        if not candidates:
            print("No products found.")
            return []

        print(f"Found {len(candidates)} candidates via Cosine Search. Reranking...")
        
        # 3. STAGE 2: Cross-Encoder Reranking
        client = InferenceClient(token=HF_TOKEN, provider="hf-inference")
        
        # Prepare pairs of (query, document) for the Cross-Encoder
        # We concatenate product details to give the reranker max context
        rerank_pairs = []
        for product in candidates:
            doc_text = f"Product: {product.name}. Type: {product.product_type}. Price: ${product.price}. Description: {product.description}"
            rerank_pairs.append({"text": query, "text_pair": doc_text})
            
        try:
            # Query the HF Serverless API
            rerank_scores = client.text_classification(
                rerank_pairs, 
                model="cross-encoder/ms-marco-MiniLM-L-6-v2"
            )
            
            # The API returns a list of lists of dicts e.g. [[{'label': 'LABEL_0', 'score': 0.8}], ...]
            # We map the scores back to the products
            scored_candidates = []
            for i, product in enumerate(candidates):
                # Assuming the first label's score indicates relevance
                score = rerank_scores[i][0]['score'] if rerank_scores[i] else 0.0
                scored_candidates.append((score, product))
                
            # Sort by score descending (highest score first)
            scored_candidates.sort(key=lambda x: x[0], reverse=True)
            
            # Extract the top_k products
            best_products = [item[1] for item in scored_candidates[:top_k]]
            
        except Exception as e:
            print(f"Cross-encoder reranking failed: {e}. Falling back to standard Cosine results.")
            best_products = candidates[:top_k]
        
        print(f"\nTop {top_k} results:")
        for idx, product in enumerate(best_products, 1):
            print(f"{idx}. {product.name} (${product.price}) - {product.product_type}")
            print(f"   Field: {product.product_field}")
            print(f"   Description: {product.description}")
            print(f"   Link: {product.Product_Webpage_url}\n")
            
        return best_products

