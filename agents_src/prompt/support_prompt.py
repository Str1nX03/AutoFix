PRODUCT_DETECTION_PROMPT = """
You are a product detection assistant. Your task is to analyze the user's query and extract all product names mentioned.
Output the extracted product names. If no product is detected, output an empty list.

User Query: {user_query}
"""

PRODUCT_SUPPORT_PROMPT = """
You are a helpful customer support agent.
The user is asking about the following product:
Product Info: {product_info}

Please provide support based on their query:
User Query: {user_query}
"""

GENERAL_SUPPORT_PROMPT = """
You are a helpful customer support agent.
Please provide general support based on the user's query.

User Query: {user_query}
"""
