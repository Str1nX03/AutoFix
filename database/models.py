


# database/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.db import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, unique=True, index=True, nullable=False)
    website_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to products
    products = relationship("Product", back_populates="owner")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    price = Column(String) # Storing as string for simplicity (e.g., "$50" or "Rs. 5000")
    
    # Relationship back to client
    owner = relationship("Client", back_populates="products")

# In the future, you will add ChatSessions and ChatMessages tables here