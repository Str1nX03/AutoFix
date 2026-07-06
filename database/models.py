


# database/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from database.db import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    product_type = Column(String, nullable=False)
    product_field = Column(String, nullable=False)    
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    price = Column(String) 
    Product_Webpage_url = Column(String, nullable=False)
    product_issues = Column(String, nullable=True)

    embedding = relationship("ProductEmbedding", back_populates="product", uselist=False, cascade="all, delete-orphan")

class ProductEmbedding(Base):
    __tablename__ = "product_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="CASCADE"), unique=True, nullable=False)
    # 768 is the dimension size for Google Gemini's text-embedding-004 model
    embedding = Column(Vector(768)) 

    product = relationship("Product", back_populates="embedding")

# In the future, you will add ChatSessions and ChatMessages tables here