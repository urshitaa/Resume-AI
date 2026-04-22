from fastapi import APIRouter, Depends
from pydantic import BaseModel, HttpUrl

from app.dependencies import get_current_user
from app.models.user import User
from app.services.scraper_service import scrape_job_description

router = APIRouter(prefix="/api/job", tags=["Job"])


class ScrapeRequest(BaseModel):
    url: HttpUrl


@router.post("/scrape")
def scrape_job(
    payload: ScrapeRequest,
    current_user: User = Depends(get_current_user),
):
    text = scrape_job_description(str(payload.url))
    return {"text": text}
