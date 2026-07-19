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
        # 2. Fetch plenty of candidates to handle broad queries
        candidate_count = 50
        stmt = (
            select(Product)
            .order_by(Product.embedding.cosine_distance(query_embedding))
            .limit(candidate_count)
        )
        
        result = await session.execute(stmt)
        candidate_rows = result.all()
        best_products = [row[0] for row in candidate_rows]
        
        # 3. Heuristic Type Filtering (For pinpoint E-commerce accuracy)
        # If the user explicitly asks for a specific product type (like "Mouse"), 
        # we strictly filter the candidates to ensure high relevance.
        query_lower = query.lower()
        mentioned_types = set()
        for p in best_products:
            if p.product_type.lower() in query_lower:
                mentioned_types.add(p.product_type.lower())
                
        if mentioned_types:
            best_products = [p for p in best_products if p.product_type.lower() in mentioned_types]
        
        # Return only up to top_k to avoid overloading the LLM
        return best_products[:top_k]

