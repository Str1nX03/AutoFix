# backend/app/main.py
import logging
import uuid

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db
from backend.app.schemas import ChatRequest, ChatResponse
from agents_src.agent.support_agent import (
    handle_sql, 
    generate_final_response
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="AutoFix AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# main.py — replace current health check
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    status = {"status": "healthy", "database": "up", "api": "up"}
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail={"status": "unhealthy", "database": "down", "api": "up"}
        )
    return status

@app.post("/api/chat", response_model=ChatResponse)
def process_chat(request: ChatRequest, db: Session = Depends(get_db)):
    
    request_id = str(uuid.uuid4())  # unique ID per request
    logger.info(f"[{request_id}] New request | session={request.session_id}")

    if not request.messages:
        raise HTTPException(status_code=400, detail="Message history cannot be empty.")

    try:
        latest_message = request.messages[-1].content
        logger.info(f"[{request_id}] Calling handle_sql")
        
        raw_data = handle_sql(latest_message, db)
        logger.info(f"[{request_id}] SQL success | rows={len(raw_data) if raw_data else 0}")

        logger.info(f"[{request_id}] Calling generate_final_response")
        final_output = generate_final_response(request.messages, raw_data)
        logger.info(f"[{request_id}] Response generated successfully")

        return ChatResponse(reply=final_output, source_used="SQL")

    except HTTPException:
        raise

    except ConnectionError as e:
        # DB is down
        logger.error(f"[{request_id}] DB connection failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please try again shortly."
        )

    except TimeoutError as e:
        # LLM or DB took too long
        logger.error(f"[{request_id}] Timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request timed out. Please try again."
        )

    except Exception as e:
        # Catch everything else — never expose internals
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Something went wrong. Please try again."
        )