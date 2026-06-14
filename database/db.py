


# database/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the connection string from Neon
SQLALCHEMY_DATABASE_URL = os.getenv("NEON_DATABASE_URL")

# Create the engine (The core interface to the database)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory (To talk to the DB securely)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models to inherit from
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()