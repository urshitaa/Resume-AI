from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.utils.database import get_db
from app.dependencies import get_current_user
from app.models.resume_version import ResumeVersion
from app.models.analysis import Analysis

router = APIRouter(prefix="/api/history", tags=["History"])


class ResumeVersionResponse(BaseModel):
    id: int
    filename: str
    created_at: str
    improved_text: str | None = None

    class Config:
        from_attributes = True


class AnalysisHistoryResponse(BaseModel):
    id: int
    ats_score: float
    created_at: str

    class Config:
        from_attributes = True


@router.get("/versions", response_model=List[ResumeVersionResponse])
def get_resume_versions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    versions = db.query(ResumeVersion).filter(ResumeVersion.user_id == current_user.id).order_by(ResumeVersion.created_at.desc()).all()
    # We mock filename from ID for now if it's missing
    result = []
    for v in versions:
        result.append({
            "id": v.id,
            "filename": f"Version {v.id}",
            "created_at": v.created_at.isoformat(),
            "improved_text": v.improved_text
        })
    return result


@router.get("/ats", response_model=List[AnalysisHistoryResponse])
def get_ats_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.asc()).all()
    result = []
    for a in analyses:
        result.append({
            "id": a.id,
            "ats_score": a.ats_score,
            "created_at": a.created_at.isoformat()
        })
    return result
