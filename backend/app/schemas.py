# schemas.py
from pydantic import BaseModel, Field
from typing import List, Literal

class MessageItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2000)

class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=100)
    messages: List[MessageItem] = Field(min_items=1, max_items=50)

class ChatResponse(BaseModel):
    reply: str
    source_used: str