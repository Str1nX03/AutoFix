# agents_src/agent/support_agent.py
import sys
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from agents_src.config import get_settings
from agents_src.utils import get_llm, get_fast_llm
from agents_src.exception import CustomException
from agents_src.logger import logging


def handle_sql(message: str, db: Session) -> str:
    """
    Queries the products table based on user message keywords.
    Returns relevant rows as a formatted string for the LLM.
    """
    try:
        logging.info(f"handle_sql called with message: {message}")

        # Extract keyword using fast LLM
        fast_llm = get_fast_llm()
        keyword_response = fast_llm.invoke([
            SystemMessage(content=(
                "Extract the single most important product search keyword from the user message. "
                "Reply with ONLY the keyword, nothing else. No punctuation, no explanation."
                "Examples: 'keyboard', 'monitor', 'mouse', 'headphones'"
            )),
            HumanMessage(content=message)
        ])
        keyword = keyword_response.content.strip().lower()
        logging.info(f"Extracted keyword: {keyword}")

        # Query DB with keyword — parameterized, safe from SQL injection
        result = db.execute(
            text("""
                SELECT product_name, sku, price, in_stock, description
                FROM products
                WHERE LOWER(product_name) LIKE :kw
                OR LOWER(description) LIKE :kw
            """),
            {"kw": f"%{keyword}%"}
        ).fetchall()

        if not result:
            # Fallback — return all products if no match
            logging.info("No keyword match, returning all products")
            result = db.execute(
                text("SELECT product_name, sku, price, in_stock, description FROM products")
            ).fetchall()

        # Format rows as readable string for LLM
        formatted = []
        for row in result:
            stock_status = "In Stock" if row.in_stock > 0 else "Out of Stock"
            formatted.append(
                f"- {row.product_name} (SKU: {row.sku}) | "
                f"Price: ${row.price} | "
                f"{stock_status} ({row.in_stock} units) | "
                f"{row.description}"
            )

        output = "\n".join(formatted)
        logging.info(f"SQL returned {len(result)} rows")
        return output

    except Exception as e:
        logging.error(f"handle_sql failed: {str(e)}")
        raise CustomException(e, sys)


def generate_final_response(messages: List, raw_data: str) -> str:
    """
    Takes conversation history and DB results, returns natural LLM response.
    """
    try:
        logging.info("generate_final_response called")
        llm = get_llm()

        # Build message history for LLM
        langchain_messages = [
            SystemMessage(content=(
                "You are a helpful product assistant. "
                "Answer the user's question using ONLY the product data provided. "
                "Be concise and friendly. "
                "If a product is out of stock, mention it clearly. "
                "Never make up products or prices not in the data. "
                "If the data doesn't contain what the user asked for, say so honestly."
                f"\n\nAvailable product data:\n{raw_data}"
            ))
        ]

        # Add conversation history
        for msg in messages[:-1]:  # all except latest
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))

        # Add latest user message
        langchain_messages.append(HumanMessage(content=messages[-1].content))

        response = llm.invoke(langchain_messages)
        logging.info("LLM response generated successfully")
        return response.content

    except Exception as e:
        logging.error(f"generate_final_response failed: {str(e)}")
        raise CustomException(e, sys)