import asyncio
from database.db import engine
from sqlalchemy import text

async def migrate_db():
    print("Starting database migration...")
    async with engine.begin() as conn:
        print("Adding embedding column to products table...")
        try:
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS embedding vector(768);"))
        except Exception as e:
            print(f"Failed to add column (it might already exist): {e}")

        print("Dropping product_embeddings table...")
        try:
            await conn.execute(text("DROP TABLE IF EXISTS product_embeddings;"))
        except Exception as e:
            print(f"Failed to drop table (it might not exist): {e}")
            
    print("Migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(migrate_db())
