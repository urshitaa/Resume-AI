from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from typing import Generator

from app.utils.config import get_settings

settings = get_settings()
 
 # ── Engine ────────────────────────────────────────────────────────────────────
print(" 😂😂😂😂😂😂😂" + settings.db_url)

engine = create_engine(
    settings.db_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=5,
    max_overflow=10,
    echo=settings.debug,
    connect_args={
        "ssl": {
            "ssl_mode": "REQUIRED"
        }
    }
)
# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ── Base class for all ORM models ─────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Dependency — use in FastAPI route parameters ──────────────────────────────
def get_db() -> Generator[Session, None, None]:
    """
    Yields a database session and ensures it is closed after the request,
    even if an exception is raised.

    Usage:
        @router.get("/example")
        def example(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Health-check helper ───────────────────────────────────────────────────────
def check_db_connection() -> bool:
    """Returns True if the database is reachable, False otherwise."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
