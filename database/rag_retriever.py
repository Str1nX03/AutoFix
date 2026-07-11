import asyncio
import os
from huggingface_hub import InferenceClient
from sqlalchemy.future import select
from database.db import AsyncSessionLocal
from database.models import Product
from database.utils import generate_embeddings
from dotenv import load_dotenv

env_path = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))
load_dotenv(dotenv_path=env_path)
HF_TOKEN = os.getenv("HUGGINGFACE_HUB_API_TOKEN")

async def search_products(query: str, top_k: int = 10):
    """Search for products in the database using Hugging Face embeddings and Cross-Encoder reranking."""
    
    
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
            select(Product, Product.embedding.cosine_distance(query_embedding).label('distance'))
            .order_by(Product.embedding.cosine_distance(query_embedding))
            .limit(candidate_count)
        )
        
        result = await session.execute(stmt)
        candidate_rows = result.all()
        
        # 3. Dynamic Margin Thresholding (The real fix!)
        # Instead of a flaky reranker, we look at the absolute best match's score.
        # We only keep other products if their distance is extremely close to the best match.
        top_distance = candidate_rows[0][1]
        strict_margin = 0.08  # Only allow items within 0.08 distance of the best match
        
        best_products = []
        for row in candidate_rows:
            product = row[0]
            distance = row[1]
            
            # If the product's distance is within the strict margin of our best match, keep it!
            if distance <= top_distance + strict_margin:
                best_products.append(product)
        # 4. Heuristic Type Filtering (For pinpoint E-commerce accuracy)
        # If the user explicitly asks for a specific product type (like "CPU"), 
        # we strictly drop candidates that belong to a different product type.
        query_lower = query.lower()
        mentioned_types = set()
        for p in best_products:
            if p.product_type.lower() in query_lower:
                mentioned_types.add(p.product_type.lower())
                
        # If the user mentioned specific product types, STRICTLY filter out the others
        if mentioned_types:
            best_products = [p for p in best_products if p.product_type.lower() in mentioned_types]
        
        return best_products

