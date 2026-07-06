import asyncio
from sqlalchemy import text
from database.db import engine
from database.models import ProductEmbedding

async def reset_embeddings_table():
    print("Dropping existing product_embeddings table...")
    async with engine.begin() as conn:
        # Drop only the product_embeddings table
        await conn.run_sync(ProductEmbedding.__table__.drop, checkfirst=True)
        print("Recreating product_embeddings table with 768 dimensions...")
        await conn.run_sync(ProductEmbedding.__table__.create, checkfirst=True)
    print("Table recreated successfully!")

if __name__ == "__main__":
    asyncio.run(reset_embeddings_table())
