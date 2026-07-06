# backend/app/main.py
import logging
import os
import uuid

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db
from backend.app.schemas import ChatRequest, ChatResponse
from agents_src.agent.support_agent import SupportAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize agent once at startup — not on every request
agent = SupportAgent()

app = FastAPI(title="AutoFix AI Backend")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] New request | session={request.session_id}")

    try:
        latest_message = request.messages[-1].content
        logger.info(f"[{request_id}] Running agent")

        result = agent.run(
            query=latest_message,
            session_id=request.session_id
        )

        response = result.get("support_response", "I'm sorry, I couldn't process that.")
        logger.info(f"[{request_id}] Agent responded successfully")

        return ChatResponse(reply=response, source_used="agent")

    except HTTPException:
        raise

    except ConnectionError as e:
        logger.error(f"[{request_id}] DB connection failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Database unavailable. Please try again shortly.")

    except TimeoutError as e:
        logger.error(f"[{request_id}] Timeout: {str(e)}")
        raise HTTPException(status_code=504, detail="Request timed out. Please try again.")

    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")