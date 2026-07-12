<p align="center">
  <img src="https://img.shields.io/badge/AutoFix-AI%20Support%20Agent-00d26a?style=for-the-badge&logo=openai&logoColor=white" alt="AutoFix Banner"/>
</p>

<h1 align="center">🤖 AutoFix</h1>

<p align="center">
  <b>Intelligent, Agentic AI Customer Support — Powered by LangGraph & RAG</b>
</p>

<p align="center">
  <a href="https://github.com/Str1nX03/AutoFix/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Str1nX03/AutoFix?style=flat-square&color=00d26a" alt="License"></a>
  <a href="https://github.com/Str1nX03/AutoFix/stargazers"><img src="https://img.shields.io/github/stars/Str1nX03/AutoFix?style=flat-square&color=f5c518" alt="Stars"></a>
  <a href="https://github.com/Str1nX03/AutoFix/issues"><img src="https://img.shields.io/github/issues/Str1nX03/AutoFix?style=flat-square&color=ff6b6b" alt="Issues"></a>
  <a href="https://github.com/Str1nX03/AutoFix"><img src="https://img.shields.io/badge/python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://github.com/Str1nX03/AutoFix"><img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
</p>

---

## 📖 Overview

**AutoFix** is a full-stack, production-ready AI customer support system that uses an **agentic workflow** to intelligently assist users. It detects product mentions in natural language, retrieves matching products from a vector database using **RAG (Retrieval-Augmented Generation)**, and generates context-aware, beautifully formatted responses — all in real time.

> **Think of it as a support agent that actually _understands_ your product catalog.**

### ✨ Key Highlights

- 🧠 **Agentic Architecture** — A multi-node LangGraph state machine that routes queries through product detection, vector retrieval, and response generation.
- 🔍 **RAG-Powered Search** — Semantic product search using HuggingFace embeddings + pgvector on Neon PostgreSQL with dynamic margin thresholding.
- ⚡ **Async Everything** — Fully asynchronous backend built on FastAPI + SQLAlchemy AsyncSession for high-throughput, non-blocking I/O.
- 🎨 **Modern Frontend** — Sleek Next.js 16 landing page with Framer Motion animations, Tailwind CSS, and a live chatbot demo.
- 🚀 **One-Click Deploy** — Pre-configured `render.yaml` for instant deployment to Render (backend + frontend).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 16)                    │
│  Navbar · Hero · Services · Live Demo · FAQ · CTA · Footer      │
│                     Framer Motion + Tailwind                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │  POST /api/chat
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Uvicorn)                 │
│                                                                 │
│   /health ──── DB Health Check                                  │
│   /api/chat ── Invokes SupportAgent.arun()                      │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AGENTIC AI (LangGraph + Groq)                 │
│                                                                 │
│   ┌──────────────────┐                                          │
│   │Product Detection │─── yes ──▶ Retrieve Product Info (RAG)  │
│   │    (LLM Node)    │              │                           │
│   └────────┬─────────┘              ▼                           │
│            │ no              Product Support (LLM)              │
│            ▼                        │                           │
│     General Support (LLM)           │                           │
│            │                        │                           │
│            └────────────┬───────────┘                           │
│                         ▼                                       │
│                       [END]                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE (Neon PostgreSQL + pgvector)              │
│                                                                 │
│   products table ── name, type, description, price, url         │
│                     embedding (Vector 768-dim)                  │
│                                                                 │
│   Embeddings: HuggingFace BAAI/bge-large-en-v1.5                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
AutoFix/
├── agents_src/                # 🧠 Agentic AI core
│   ├── agent/
│   │   └── support_agent.py   # LangGraph state machine (SupportAgent)
│   ├── prompt/
│   │   └── support_prompt.py  # Prompt templates (detection, product, general)
│   ├── config.py              # Pydantic settings (API keys, LangSmith)
│   ├── utils.py               # LLM initialization (Groq)
│   └── exception.py           # Custom exception handler
│
├── backend/                   # ⚡ FastAPI REST API
│   ├── app/
│   │   ├── main.py            # App entrypoint, CORS, /health, /api/chat
│   │   └── schemas.py         # Pydantic request/response models
│   └── requirements.txt
│
├── database/                  # 🗃️ Data layer (Neon + pgvector)
│   ├── db.py                  # Async engine & session factory
│   ├── models.py              # SQLAlchemy ORM (Product + Vector)
│   ├── crud.py                # CRUD operations
│   ├── rag_retriever.py       # Vector search + margin thresholding
│   ├── seed_db.py             # Seed script with 30 products
│   ├── init_db.py             # Table initialization
│   └── utils.py               # Embedding generation (HuggingFace)
│
├── frontend/                  # 🎨 Next.js 16 landing page
│   └── src/
│       ├── app/               # Pages, layout, SEO, API routes
│       └── components/        # Hero, Navbar, ChatBotUi, Demo, FAQ, etc.
│
├── .env_example               # Environment variable template
├── render.yaml                # Render deployment blueprint
├── requirements.txt           # Root Python dependencies
└── LICENSE                    # MIT License
```

---

## 🧠 How the Agent Works

AutoFix uses a **LangGraph state graph** with conditional routing:

| Node | Purpose |
|---|---|
| **Product Detection** | Uses structured LLM output (JSON mode) to extract product names/categories from the user query |
| **Retrieve Product Info** | Performs cosine-similarity vector search on Neon PostgreSQL, applies dynamic margin thresholding, and filters by product type |
| **Product Support** | Generates a rich, context-aware response with product details, formatted as Markdown tables or bullet points |
| **General Support** | Handles non-product queries (store info, greetings, category listings) |

The agent maintains **conversation memory** via LangGraph's `MemorySaver` checkpointer, tracking chat history and previously shown products per session.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI / Agent Framework** | LangGraph, LangChain, Groq (OpenAI GPT-OSS-20B) |
| **Embeddings** | HuggingFace `BAAI/bge-large-en-v1.5` (768-dim) |
| **Vector Database** | Neon PostgreSQL + pgvector |
| **Backend API** | FastAPI, Uvicorn, SQLAlchemy (Async), Pydantic |
| **Frontend** | Next.js 16, React 19, Framer Motion, Tailwind CSS, shadcn/ui |
| **Observability** | LangSmith (tracing & debugging) |
| **Deployment** | Render (backend + frontend) |

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 20+
- **Neon PostgreSQL** account ([neon.tech](https://neon.tech)) with pgvector enabled
- API keys: **Groq**, **HuggingFace**, **LangChain** (optional, for tracing)

### 1. Clone the Repository

```bash
git clone https://github.com/Str1nX03/AutoFix.git
cd AutoFix
```

### 2. Set Up Environment Variables

```bash
cp .env_example .env
```

Edit `.env` and fill in your credentials:

```env
GROQ_API_KEY=your_groq_api_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key     # Optional
LANGCHAIN_PROJECT=AutoFix
EMBEDDING_MODEL=BAAI/bge-large-en-v1.5
HUGGINGFACE_HUB_API_TOKEN=your_hf_token
NEON_DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<dbname>
```

### 3. Install Backend Dependencies

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 4. Initialize & Seed the Database

```bash
python -m database.init_db
python -m database.seed_db
```

### 5. Start the Backend

```bash
uvicorn backend.app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Check health at `http://localhost:8000/health`.

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## 🌐 API Reference

### `GET /health`

Health check endpoint. Returns database and API status.

```json
{
  "status": "healthy",
  "database": "up",
  "api": "up"
}
```

### `POST /api/chat`

Send a chat message to the AI agent.

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "messages": [
    {
      "role": "user",
      "content": "Can you recommend a gaming keyboard?"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Here are some great gaming keyboards from our catalog...",
  "source_used": "agent"
}
```

---

## ☁️ Deployment

AutoFix includes a pre-configured [`render.yaml`](render.yaml) for one-click deployment on **Render**:

1. Push your code to GitHub
2. Create a new **Blueprint** on [Render](https://render.com)
3. Connect your repo and select the `render.yaml`
4. Set the environment variables (`GROQ_API_KEY`, `DATABASE_URL`, etc.) in the Render dashboard
5. Deploy 🚀

The blueprint provisions:
- **autofix-backend** — Python web service (FastAPI + Uvicorn)
- **autofix-frontend** — Node.js web service (Next.js)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 👥 Team

| Contributor | GitHub |
|---|---|
| Dravin Kumar Sharma | [@Str1nX03](https://github.com/Str1nX03) |
| Bibhanshu Singh | [@Bibhanshu16](https://github.com/Bibhanshu16) |
| Shiv Prakash Singh | [@ShivSingh-17](https://github.com/ShivSingh-17) |
| US Jagan Krishna | [@maleniabladeofmequilla](https://github.com/maleniabladeofmequilla) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ by the AutoFix team</sub>
</p>
