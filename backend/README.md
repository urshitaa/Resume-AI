# ResumeAI — Backend

AI-powered Resume–Job Matcher, Resume Editor & Career Assistant.

## Tech Stack
- **FastAPI** + Uvicorn
- **MySQL** via SQLAlchemy 2.0
- **Alembic** for migrations
- **Gemini** + **Grok** (no OpenAI)
- PyMuPDF · python-docx · spaCy · Sentence-BERT · ReportLab

---

## Quick Start

### 1. Clone & create virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — fill in DB credentials and API keys
```

### 3. Create the MySQL database
```sql
CREATE DATABASE resumeai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Verify
| Endpoint | Expected |
|----------|----------|
| `GET /` | `{"message": "API is running", ...}` |
| `GET /health` | `{"status": "ok", ...}` |
| `GET /docs` | Swagger UI |

---

## Project Structure
```
resumeai-backend/
├── app/
│   ├── main.py          ← FastAPI app + lifespan + core routes
│   ├── config.py        ← Pydantic Settings (reads .env)
│   ├── database.py      ← SQLAlchemy engine, session, Base
│   ├── models/          ← ORM model classes
│   ├── schemas/         ← Pydantic request/response schemas
│   ├── routers/         ← APIRouter modules (one per feature)
│   ├── services/        ← Business logic (parsing, AI, scoring…)
│   └── utils/           ← Shared helpers (JWT, file utils…)
├── uploads/             ← User-uploaded files (git-ignored)
├── .env.example
├── .gitignore
└── requirements.txt
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing key |
| `DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME` | MySQL connection |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GROK_API_KEY` | xAI Grok API key |
| `UPLOAD_DIR` | Directory for uploaded resumes |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
