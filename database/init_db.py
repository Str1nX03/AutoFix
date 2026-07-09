import asyncio
import sys
from database.db import engine, Base
from database.models import Product, ProductEmbedding
from sqlalchemy import text

async def init_db():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_db())
