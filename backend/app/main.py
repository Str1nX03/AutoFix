# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

from backend.app.database import get_db
from backend.app.schemas import ChatRequest, ChatResponse

# IMPORTING ONLY THE SQL AND SYNTHESIS LOGIC
from agents_src.agent.support_agent import (
    handle_sql, 
    generate_final_response
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AutoFix AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from sqlalchemy import text

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Perform a dummy query to check DB connectivity
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "up"}
    except Exception as e:
        # If this fails, the DB is down, return a 503 error
        raise HTTPException(status_code=503, detail="Database connection failed")

@app.post("/api/chat", response_model=ChatResponse)
def process_chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Core AI Agent Endpoint connecting React UI to the agents_src logic.
    """
    if not request.messages:
        raise HTTPException(status_code=400, detail="Message history cannot be empty.")

    try:
        # Grab the user's newest question
        latest_message = request.messages[-1].content

        # 1. Fetch data directly using the SQL Agent (No routing needed)
        raw_data = handle_sql(latest_message, db)

        # 2. Synthesize final answer
        final_output = generate_final_response(request.messages, raw_data)

        # Hardcode source_used to SQL since RAG is gone
        return ChatResponse(reply=final_output, source_used="SQL")
    
    except Exception as e:
        logger.error(f"Agent Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail="The AI assistant encountered an error.")