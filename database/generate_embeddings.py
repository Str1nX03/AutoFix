import asyncio
import os
from google import genai
from google.genai import types
from sqlalchemy.future import select
from database.db import AsyncSessionLocal
from database.models import Product, ProductEmbedding
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_and_store_embeddings():
    print("Loading all products from database...")
    async with AsyncSessionLocal() as session:
        # Fetch all products
        result = await session.execute(select(Product))
        products = result.scalars().all()
        
        if not products:
            print("No products found in the database. Please seed the database first.")
            return

        print(f"Found {len(products)} products. Generating embeddings via Google Gemini API sequentially to respect the 15 RPM free tier limit...")
        print("This will take approximately 2 minutes to complete. Please wait...\n")
        
        for idx, product in enumerate(products):
            combined_text = (
                f"Product: {product.name}. "
                f"Type: {product.product_type}. "
                f"Field: {product.product_field}. "
                f"Price: ${product.price}. "
                f"Description: {product.description}."
            )
            
            # Generate the embedding using the new Gemini SDK with 768 dimensions
            response = client.models.embed_content(
                model="gemini-embedding-2",
                contents=combined_text,
                config=types.EmbedContentConfig(output_dimensionality=768)
            )
            embedding_values = response.embeddings[0].values
            
            # Check if embedding already exists
            existing_emb_query = await session.execute(
                select(ProductEmbedding).where(ProductEmbedding.product_id == product.product_id)
            )
            existing_emb = existing_emb_query.scalar_one_or_none()
            
            if existing_emb:
                existing_emb.embedding = embedding_values
            else:
                new_embedding = ProductEmbedding(
                    product_id=product.product_id,
                    embedding=embedding_values
                )
                session.add(new_embedding)
            
            print(f"[{idx+1}/{len(products)}] Generated embedding for {product.name}")
            
            # Sleep for 4.5 seconds to ensure we don't exceed the 15 requests per minute limit
            if idx < len(products) - 1:
                await asyncio.sleep(4.5)
        
        # Commit the changes to the database
        await session.commit()
        print("Successfully generated and stored embeddings for all products!")

if __name__ == "__main__":
    asyncio.run(generate_and_store_embeddings())
