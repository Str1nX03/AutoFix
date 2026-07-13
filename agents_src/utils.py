from langchain_groq import ChatGroq
from agents_src.config import get_settings
from agents_src.exception import CustomException
import sys
import random

settings = get_settings()

current_key_index = None

def get_llm() -> ChatGroq:
    """
    Initializes and returns the main large language model (LLM) instance.
    Uses the `openai/gpt-oss-20b` model via the Groq API.
    Supports a Round-Robin fallback system using GROQ_API_KEYS to prevent rate limits.
    """
    global current_key_index

    try:
        
        keys = []
        if settings.GROQ_API_KEYS:
            keys = [k.strip() for k in settings.GROQ_API_KEYS.split(",") if k.strip()]
        elif settings.GROQ_API_KEY:
            keys = [settings.GROQ_API_KEY]
            
        if not keys:
            raise ValueError("No GROQ_API_KEY or GROQ_API_KEYS found in environment variables.")

        if len(keys) == 1:
            return ChatGroq(
                model="openai/gpt-oss-20b",
                temperature=0.2,
                max_tokens=2000,
                groq_api_key=keys[0]
            )

        if current_key_index is None:
            current_key_index = random.randint(0, len(keys) - 1)

        llms = [
            ChatGroq(model="openai/gpt-oss-20b", temperature=0.2, max_tokens=2000, groq_api_key=key)
            for key in keys
        ]

        primary_llm = llms[current_key_index]
        
        fallback_llms = []
        for i in range(1, len(llms)):
            idx = (current_key_index + i) % len(llms)
            fallback_llms.append(llms[idx])

        current_key_index = (current_key_index + 1) % len(keys)

        return primary_llm.with_fallbacks(fallback_llms)
    
    except Exception as e:
        raise CustomException(e, sys)