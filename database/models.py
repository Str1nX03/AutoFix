


# database/models.py
from sqlalchemy import Column, Integer, String, Text
from database.db import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    product_type = Column(String, nullable=False)
    product_field = Column(String, nullable=False)    
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    price = Column(String) # Storing as string for simplicity (e.g., "$50" or "Rs. 5000")
    Product_Webpage_url = Column(String, nullable=False)
    product_issues = Column(String, nullable=False)
    
# In the future, you will add ChatSessions and ChatMessages tables here