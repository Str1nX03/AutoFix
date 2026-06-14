# app/agents/sql_engine.py
from sqlalchemy.orm import Session

def handle_sql(message: str, db: Session) -> str:
    """
    Dravin: The LLM will convert the user's message into a SQL query here,
    run it against the Neon database using the 'db' session, and return the raw JSON.
    """
    
    # Mock database result
    mock_db_result = (
        "{'product': 'Premium Mechanical Keyboard', "
        "'price': 129.99, "
        "'in_stock': 45}"
    )
    
    return mock_db_result