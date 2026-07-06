from langchain_groq import ChatGroq
from agents_src.config import get_settings
from agents_src.exception import CustomException
from agents_src.logger import logging
import sys

settings = get_settings()

def get_llm() -> ChatGroq:
    """
    Initializes and returns the main large language model (LLM) instance.
    Uses the `openai/gpt-oss-20b` model via the Groq API.
    This model is best suited for complex reasoning and structured data extraction tasks.
    
    Returns:
        ChatGroq: An initialized instance of the ChatGroq LLM.
        
    Raises:
        CustomException: If there's an error during LLM initialization.
    """
    try:

        logging.info("Retrieving the Groq LLM")

        llm = ChatGroq(
            model = "openai/gpt-oss-20b",
            temperature = 0.2,
            max_tokens = 2000,
            groq_api_key = settings.GROQ_API_KEY
        )
        logging.info("Groq LLM retrieved successfully")

        return llm
    
    except Exception as e:
        raise CustomException(e, sys)