# app/schemas.py
from pydantic import BaseModel
from typing import List

class MessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: str
    messages: List[MessageItem]

class ChatResponse(BaseModel):
    reply: str
    source_used: str
    