


# database/crud.py
from sqlalchemy.orm import Session
from database import models

# --- CLIENT OPERATIONS ---

def create_client(db: Session, company_name: str, website_url: str):
    db_client = models.Client(company_name=company_name, website_url=website_url)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

# --- PRODUCT OPERATIONS ---

def create_product(db: Session, client_id: int, name: str, description: str, price: str):
    db_product = models.Product(
        client_id=client_id, 
        name=name, 
        description=description, 
        price=price
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products_by_client(db: Session, client_id: int):
    return db.query(models.Product).filter(models.Product.client_id == client_id).all()