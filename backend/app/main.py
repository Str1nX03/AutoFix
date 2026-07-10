# backend/app/main.py
import logging
import uuid

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from database.db import get_db
from backend.app.schemas import ChatRequest, ChatResponse
from agents_src.agent.support_agent import SupportAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

agent = SupportAgent()

app = FastAPI(title="AutoFix AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    status = {"status": "healthy", "database": "up", "api": "up"}
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail={"status": "unhealthy", "database": "down", "api": "up"}
        )
    return status

@app.post("/api/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] New request | session={request.session_id}")

    try:
        latest_message = request.messages[-1].content
        logger.info(f"[{request_id}] Running agent")

        # agent.run is sync (LangGraph), run in thread to not block event loop
        import asyncio
        response = await asyncio.to_thread(
            agent.run,
            query=latest_message,
            session_id=request.session_id
        )

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