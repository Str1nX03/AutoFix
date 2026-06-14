from sqlalchemy import Column, Integer, String, Numeric, Text
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    in_stock = Column(Integer, default=0) # demoing inventory checks
    description = Column(Text, nullable=True)