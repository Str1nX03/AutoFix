


# database/models.py
from sqlalchemy import Column, Integer, String, Text , JSON
from database.db import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    product_type = Column(String, nullable=False)
    product_field = Column(String, nullable=False)    
    product_name = Column(String, index=True, nullable=False)
    product_description = Column(Text)
    product_price = Column(Integer) 
    product_url = Column(String, nullable=False)
    product_issues = Column(JSON, nullable=False)

# In the future, you will add ChatSessions and ChatMessages tables here