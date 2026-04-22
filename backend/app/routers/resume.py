import os
from fastapi.responses import FileResponse
from app.services.pdf_service import build_resume_pdf

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.services.llm_service import generate_response

router = APIRouter(prefix="/api/resume", tags=["Resume"])


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
