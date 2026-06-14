from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.agents.router import route_query
from app.agents.rag_engine import handle_rag
from app.agents.sql_engine import handle_sql # Using SQL for your Neon demo
from app.agents.synthesizer import generate_final_response

app = FastAPI(title="AutoFix AI Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat", response_model=ChatResponse)
def process_chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Core AI Agent Endpoint.
    """
    # 1. Grab the very last message in the array (the user's newest question)
    latest_message = request.messages[-1].content

    # 2. Route based ONLY on the newest question
    intent = route_query(latest_message)

    # 3. Fetch data using ONLY the newest question
    if intent == "SQL":
        raw_data = handle_sql(latest_message, db)
    else:
        raw_data = handle_rag(latest_message)

    # 4. Synthesis (Pass the FULL history to LLM so it has memory)
    final_output = generate_final_response(request.messages, raw_data)

    return ChatResponse(reply=final_output, source_used=intent)