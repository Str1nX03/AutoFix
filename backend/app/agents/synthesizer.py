# app/agents/synthesizer.py
from typing import List

def generate_final_response(messages: List, raw_data: str) -> str:
    """
    Dravin: 'messages' is now a full array of the chat history from the frontend.
    Pass this entire array to the LLM so it remembers the context!
    """
    
    # Grab just the latest message for our dummy text return
    latest_user_question = messages[-1].content
    
    simulated_llm_response = (
        f"I received your question: '{latest_user_question}'.\n\n"
        f"Here is the raw context I retrieved to answer it:\n"
        f"{raw_data}\n\n"
        f"(This message will be naturally formatted once the LLM is connected!)"
    )
    
    return simulated_llm_response