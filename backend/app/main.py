"""
ResumeAI — FastAPI entry point
"""
import os
import logging
from contextlib import asynccontextmanager
 
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.utils.config import get_settings
from app.utils.database import engine, Base, check_db_connection

# Import all models so SQLAlchemy registers them before create_all()
import app.models  # noqa: F401

settings = get_settings()

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

print("GEMINI_API_KEY exists:", bool(os.getenv("GEMINI_API_KEY")))
print("LLM_PROVIDER:", os.getenv("LLM_PROVIDER"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting %s v%s", settings.app_name, settings.app_version)

    os.makedirs(settings.upload_dir, exist_ok=True)
    logger.info("📁 Upload directory ready: %s", settings.upload_dir)

    if check_db_connection():
        logger.info("✅ Database connection established")
    else:
        logger.warning(
            "⚠️  Could not reach the database — check DB_* env vars. "
            "The API will still start but DB-dependent routes will fail."
        )

    yield

    logger.info("🛑 Shutting down %s", settings.app_name)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI-powered resume–job matcher, resume editor, and career assistant.",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    cors_origins = settings.origins_list
    if not cors_origins:
        cors_origins = ["*"]
        logger.warning(
            "No allowed CORS origins configured. Falling back to wildcard origin for development."
        )

    logger.info("Configuring CORS for origins: %s", cors_origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://127.0.0.1:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "https://resume-ai-53gn.vercel.app",
        ],
        allow_origin_regex=r"https://.*resume-ai.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
 

    Base.metadata.create_all(bind=engine)

    @app.get("/", tags=["Root"], summary="API liveness check")
    async def root():
        return {"message": "API is running", "app": settings.app_name}

    @app.get("/health", tags=["Root"], summary="Health check")
    async def health():
        db_ok = check_db_connection()
        return JSONResponse(
            status_code=200 if db_ok else 503,
            content={
                "status": "ok" if db_ok else "degraded",
                "version": settings.app_version,
                "database": "connected" if db_ok else "unreachable",
            },
        )    

    from app.routers.auth import router as auth_router
    from app.routers.resume import router as resume_router
    from app.routers.job import router as job_router
    from app.routers.ats import router as ats_router
    from app.routers.chat import router as chat_router
    from app.routers.history import router as history_router
    from app.routers.testimonial import router as testimonial_router

    app.include_router(auth_router)
    app.include_router(resume_router)
    app.include_router(job_router)
    app.include_router(ats_router)
    app.include_router(chat_router)
    app.include_router(history_router)
    app.include_router(testimonial_router)

    return app


app = create_app()
