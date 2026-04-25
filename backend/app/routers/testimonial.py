from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.utils.database import get_db
from app.models.testimonial import Testimonial

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])

class TestimonialCreate(BaseModel):
    name: str
    email: str
    rating: int
    feedback: str

class TestimonialResponse(BaseModel):
    id: int
    name: str
    rating: int
    feedback: str
    created_at: str

    class Config:
        from_attributes = True

@router.post("", response_model=TestimonialResponse)
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    db_testimonial = Testimonial(
        name=payload.name,
        email=payload.email,
        rating=payload.rating,
        feedback=payload.feedback
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    
    return TestimonialResponse(
        id=db_testimonial.id,
        name=db_testimonial.name,
        rating=db_testimonial.rating,
        feedback=db_testimonial.feedback,
        created_at=db_testimonial.created_at.isoformat() if db_testimonial.created_at else ""
    )
@router.get("", response_model=List[TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    # Fetch top 6 recent testimonials
    testimonials = db.query(Testimonial).order_by(Testimonial.created_at.desc()).limit(6).all()
    
    result = []
    for t in testimonials:
        result.append(TestimonialResponse(
            id=t.id,
            name=t.name,
            rating=t.rating,
            feedback=t.feedback,
            created_at=t.created_at.isoformat() if t.created_at else ""
        ))
  
    return result
