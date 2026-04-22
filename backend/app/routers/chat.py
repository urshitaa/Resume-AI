from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.dependencies import get_current_user
from app.services.llm_service import generate_response

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    resume_context: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """You are ResumeAI, an expert career assistant specializing in:
- Resume writing and optimization
- ATS (Applicant Tracking System) strategies
- Job search advice
- Interview preparation
- Career development guidance

Always respond in clear, well-structured markdown format.
Be concise, actionable, and professional."""


def build_prompt(messages: List[Message], resume_context: Optional[str]) -> str:
    parts = [SYSTEM_PROMPT]

    if resume_context and resume_context.strip():
        parts.append(
            "\n---\n"
            "## Candidate's Resume (for context)\n"
            f"{resume_context.strip()}\n"
            "---"
        )

    parts.append("\n## Conversation")
    for msg in messages:
        role = msg.role.strip().lower()
        if role == "user":
            parts.append(f"**User:** {msg.content.strip()}")
        elif role == "assistant":
            parts.append(f"**Assistant:** {msg.content.strip()}")

    parts.append("\n**Assistant:** (respond in markdown)")
    return "\n\n".join(parts)


@router.post("", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user=Depends(get_current_user),
):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="messages list must not be empty.")

    valid_roles = {"user", "assistant"}
    for msg in payload.messages:
        if msg.role.lower() not in valid_roles:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role '{msg.role}'. Must be 'user' or 'assistant'.",
            )
        if not msg.content or not msg.content.strip():
            raise HTTPException(status_code=400, detail="Message content must not be empty.")

    prompt = build_prompt(payload.messages, payload.resume_context)

    try:
        reply = generate_response(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

    return ChatResponse(reply=reply)
