from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import json

from app.utils.database import get_db
from app.models import Analysis
from app.dependencies import get_current_user
from app.services.ats_service import compute_ats_score

router = APIRouter(prefix="/api/ats", tags=["ATS"])


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


class SectionScores(BaseModel):
    semantic: float
    skills: float
    keywords: float
    experience: float
    formatting: float


class ATSResponse(BaseModel):
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    section_scores: SectionScores
    suggestions: List[str]
    explanation: str


@router.post("/analyze", response_model=ATSResponse)
def analyze_resume(
    payload: ATSRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        result = compute_ats_score(payload.resume_text, payload.job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")

    ats_score = result.get("ats_score", 0.0)
    matched_skills = result.get("matched_skills", [])
    missing_skills = result.get("missing_skills", [])
    section_scores = result.get("section_scores", {
        "semantic": 0.0,
        "skills": 0.0,
        "keywords": 0.0,
        "experience": 0.0,
        "formatting": 0.0,
    })
    suggestions = result.get("suggestions", [])
    explanation = result.get("explanation", "")

    analysis = Analysis(
        user_id=current_user.id,
        resume_id=None,
        ats_score=ats_score,
        results_json=json.dumps({
            "resume_text": payload.resume_text,
            "job_description": payload.job_description,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "section_scores": section_scores,
            "suggestions": suggestions,
            "explanation": explanation,
        }),
    )
    try:
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")

    return ATSResponse(
        ats_score=ats_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        section_scores=SectionScores(**section_scores),
        suggestions=suggestions,
        explanation=explanation,
    )
