from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────────
    app_name: str = "ResumeAI"
    app_version: str = "1.0.0"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 20
    llm_provider: str = "gemini"

    # ── Database ─────────────────────────────────────────────────────────────────
    database_url: str | None = None
    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str = "root"
    db_password: str = "1627"
    db_name: str = "resumeai"

    # ── LLMs ─────────────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    grok_api_key: str = ""
    grok_api_base_url: str = "https://api.x.ai/v1/chat/completions"

    # ── File Uploads ─────────────────────────────────────────────────────────
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    # ── CORS ─────────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:8081"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Computed helpers ─────────────────────────────────────────────────────
    @property
    def db_url(self) -> str:
        if self.database_url:
            return self.database_url
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache()
def get_settings() -> Settings:
    """Cached singleton — import and call this everywhere."""
    return Settings()
