# app/agents/router.py

def route_query(message: str) -> str:
    """
    Determines if the query needs SQLcor RAG.
    """
    message_lower = message.lower()
    
    # If asked about specific database entities, route to SQL
    sql_keywords = ["ticket", "order", "account", "product", "price", "company"]
    
    if any(keyword in message_lower for keyword in sql_keywords):
        return "SQL"
    
    # Default to RAG for general knowledge, FAQs, and policies, Dekhlena Dravin
    return "RAG"