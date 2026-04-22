import os
import uuid
import fitz  # PyMuPDF
from docx import Document
from fastapi import HTTPException, UploadFile, status

UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

os.makedirs(UPLOAD_DIR, exist_ok=True)


def _validate_file(file: UploadFile, content: bytes) -> str:
    ext = os.path.splitext(file.filename or "")[-1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{ext}'. Only PDF and DOCX are allowed.",
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB limit.",
        )

    return ext


def _save_file(content: bytes, ext: str) -> str:
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)
    return file_path


def _extract_pdf_text(file_path: str) -> str:
    try:
        doc = fitz.open(file_path)
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
        return text.strip()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Failed to parse PDF. The file may be corrupted.",
        )


def _extract_docx_text(file_path: str) -> str:
    try:
        doc = Document(file_path)
        text = "\n".join(para.text for para in doc.paragraphs)
        return text.strip()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Failed to parse DOCX. The file may be corrupted.",
        )


async def process_uploaded_file(file: UploadFile) -> dict:
    content = await file.read()

    ext = _validate_file(file, content)
    file_path = _save_file(content, ext)

    if ext == ".pdf":
        extracted_text = _extract_pdf_text(file_path)
    else:
        extracted_text = _extract_docx_text(file_path)

    return {
        "file_path": file_path,
        "extracted_text": extracted_text,
        "filename": file.filename,
    }
