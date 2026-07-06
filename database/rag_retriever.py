import asyncio
import os
from google import genai
from google.genai import types
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database.db import AsyncSessionLocal
from database.models import Product, ProductEmbedding
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def search_products(query: str, top_k: int = 3):
    """Search for products in the database using Gemini vector similarity."""
    print(f"Searching for: '{query}'")
    
    # Generate the embedding for the user's query using new Gemini SDK
    response = client.models.embed_content(
        model="gemini-embedding-2",
        contents=query,
        config=types.EmbedContentConfig(output_dimensionality=768)
    )
    query_embedding = response.embeddings[0].values
    
    async with AsyncSessionLocal() as session:
        # Perform the vector similarity search using Cosine Distance (<=>)
        stmt = (
            select(Product)
            .join(Product.embedding)
            .options(selectinload(Product.embedding))
            .order_by(ProductEmbedding.embedding.cosine_distance(query_embedding))
            .limit(top_k)
        )
        
        result = await session.execute(stmt)
        closest_products = result.scalars().all()
        
        print(f"\nTop {top_k} results:")
        for idx, product in enumerate(closest_products, 1):
            print(f"{idx}. {product.name} (${product.price}) - {product.product_type}")
            print(f"   Field: {product.product_field}")
            print(f"   Description: {product.description}")
            print(f"   Link: {product.Product_Webpage_url}\n")
            
        return closest_products

if __name__ == "__main__":
    sample_query = "I'm looking for a cheap mouse for work"
    asyncio.run(search_products(sample_query))
