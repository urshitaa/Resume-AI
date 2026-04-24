import os
from fastapi.responses import FileResponse
from app.services.pdf_service import build_resume_pdf

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.services.llm_service import generate_response
from app.services.file_service import process_uploaded_file
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.resume import Resume
from app.models.resume_version import ResumeVersion

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        result = await process_uploaded_file(file)
        
        # Save to database
        db_resume = Resume(
            user_id=current_user.id,
            file_path=result["file_path"],
            extracted_text=result["extracted_text"],
            filename=result["filename"]
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        return {"text": result["extracted_text"], "filename": result["filename"], "resume_id": db_resume.id}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


class ResumeImproveRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeImproveResponse(BaseModel):
    improved_text: str


IMPROVE_PROMPT_TEMPLATE = """You are an expert resume writer and career coach with 15+ years of experience helping candidates land roles at top companies.

## Your Task
Rewrite and improve the candidate's resume to be highly optimized for the target job description.

## Strict Rules
- Do NOT invent, fabricate, or add any experience, skills, roles, companies, or achievements that are not present in the original resume
- Only enhance, rephrase, and restructure what already exists
- Use strong action verbs (e.g., Led, Engineered, Delivered, Accelerated, Streamlined, Drove)
- Add measurable impact wherever possible (e.g., "improved performance by X%", "reduced time by X hours") only if implied or stated in the original
- Align language and keywords with the job description naturally
- Keep the same sections and overall structure as the original

## IMPORTANT HARDCODED INSTRUCTION
Add all relevant technologies, tools, frameworks, databases,
cloud platforms, programming languages, ATS keywords,
and technical skills related to the job description.

## Improvements to Apply
1. **Professional Summary** — Rewrite to be compelling, concise (3–4 lines), and directly aligned with the job description
2. **Work Experience Bullet Points** — Rewrite each bullet using the STAR method (Situation, Task, Action, Result), start with action verbs, quantify impact where possible
3. **Skills Section** — Reorganize and prioritize skills that match the job description; group by category if appropriate
4. **Overall Language** — Remove filler words, passive voice, and weak phrases; replace with confident, results-driven language

## Output Format
Return ONLY the full improved resume as plain text (no markdown code blocks, no commentary, no explanations before or after).
Preserve all section headers exactly as they appear in the original.

---

## Target Job Description
{job_description}

---

## Original Resume
{resume_text}

---

## Improved Resume:
"""


def build_improve_prompt(resume_text: str, job_description: str) -> str:
    return IMPROVE_PROMPT_TEMPLATE.format(
        resume_text=resume_text.strip(),
        job_description=job_description.strip(),
    )


@router.post("/improve", response_model=ResumeImproveResponse)
def improve_resume(
    payload: ResumeImproveRequest,
    current_user=Depends(get_current_user),
):
    if not payload.resume_text or not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text must not be empty.")
    if not payload.job_description or not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="job_description must not be empty.")

    prompt = build_improve_prompt(payload.resume_text, payload.job_description)

    try:
        improved_text = generate_response(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

    if not improved_text or not improved_text.strip():
        raise HTTPException(status_code=500, detail="LLM returned an empty response.")

    return ResumeImproveResponse(improved_text=improved_text.strip())


class BulletImproveRequest(BaseModel):
    bullet_text: str
    job_description: str

class BulletImproveResponse(BaseModel):
    improved_bullet: str

@router.post("/improve-bullet", response_model=BulletImproveResponse)
def improve_bullet(
    payload: BulletImproveRequest,
    current_user=Depends(get_current_user),
):
    if not payload.bullet_text or not payload.bullet_text.strip():
        raise HTTPException(status_code=400, detail="bullet_text must not be empty.")
    
    prompt = f"""You are an expert resume writer. Improve the following resume bullet point to make it more impactful, using action verbs and quantifying results if implied. Ensure it aligns well with the target job description if relevant.
    
Target Job Description:
{payload.job_description}

Original Bullet Point:
{payload.bullet_text}

Provide ONLY the rewritten bullet point as plain text (no markdown, no quotes, no extra commentary)."""

    try:
        improved_bullet = generate_response(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

    return BulletImproveResponse(improved_bullet=improved_bullet.strip())


class SaveVersionRequest(BaseModel):
    resume_id: int
    improved_text: str

@router.post("/save-version")
def save_version(
    payload: SaveVersionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or not owned by user.")
        
    version = ResumeVersion(
        user_id=current_user.id,
        resume_id=resume.id,
        improved_text=payload.improved_text
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    
    return {"message": "Version saved successfully", "version_id": version.id}


class GeneratePDFRequest(BaseModel):
    resume_text: str

@router.post("/generate-pdf")
def generate_pdf(
    payload: GeneratePDFRequest,
    current_user=Depends(get_current_user),
):
    if not payload.resume_text or not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text must not be empty.")
        
    try:
        filepath = build_resume_pdf(payload.resume_text)
        return FileResponse(
            path=filepath,
            filename="resume-improved.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
