import os
import uuid
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER

GENERATED_DIR = "generated"
os.makedirs(GENERATED_DIR, exist_ok=True)

COLOR_PRIMARY = HexColor("#000000")
COLOR_ACCENT  = HexColor("#2c3e50")
COLOR_MUTED   = HexColor("#555555")
COLOR_RULE    = HexColor("#bdc3c7")

SECTION_KEYWORDS = {
    "experience", "education", "skills", "summary", "objective",
    "projects", "certifications", "awards", "publications", "languages",
    "interests", "references", "contact", "profile", "achievements",
    "volunteer", "work history", "professional experience", "technical skills",
    "work experience", "career objective", "about me",
}


def _style_name() -> ParagraphStyle:
    return ParagraphStyle("_Name", fontSize=24, leading=28, fontName="Helvetica-Bold",
                          textColor=COLOR_PRIMARY, alignment=TA_CENTER, spaceAfter=4)

def _style_contact() -> ParagraphStyle:
    return ParagraphStyle("_Contact", fontSize=10, leading=14, fontName="Helvetica",
                          textColor=COLOR_MUTED, alignment=TA_CENTER, spaceAfter=12)

def _style_section() -> ParagraphStyle:
    return ParagraphStyle("_Section", fontSize=12, leading=16, fontName="Helvetica-Bold",
                          textColor=COLOR_ACCENT, alignment=TA_LEFT, spaceBefore=12, spaceAfter=4, textTransform="uppercase")

def _style_subheading() -> ParagraphStyle:
    return ParagraphStyle("_Sub", fontSize=11, leading=15, fontName="Helvetica-Bold",
                          textColor=COLOR_PRIMARY, alignment=TA_LEFT, spaceBefore=6, spaceAfter=2)

def _style_body() -> ParagraphStyle:
    return ParagraphStyle("_Body", fontSize=10, leading=14, fontName="Helvetica",
                          textColor=COLOR_PRIMARY, alignment=TA_LEFT, spaceAfter=3)

def _style_bullet() -> ParagraphStyle:
    return ParagraphStyle("_Bullet", fontSize=10, leading=14, fontName="Helvetica",
                          textColor=COLOR_PRIMARY, alignment=TA_LEFT,
                          leftIndent=15, firstLineIndent=-10, spaceAfter=3)


def _is_section_header(line: str) -> bool:
    s = line.strip().lower().rstrip(":")
    if s in SECTION_KEYWORDS:
        return True
    stripped = line.strip()
    if stripped.isupper() and 2 <= len(stripped.split()) <= 5:
        return True
    return False


def _is_name_line(line: str, idx: int) -> bool:
    if idx > 3:
        return False
    s = line.strip()
    if not s or s.startswith(("•", "-", "*", "●", "–")):
        return False
    words = s.split()
    if 1 <= len(words) <= 5 and all(w[0].isupper() for w in words if w):
        return True
    return False


def _is_bullet(line: str) -> bool:
    return line.strip().startswith(("•", "-", "*", "●", "–"))


def _is_subheading(line: str) -> bool:
    s = line.strip()
    if not s or len(s) > 80 or s.endswith("."):
        return False
    words = s.split()
    if len(words) <= 8 and ("|" in s or ("," in s and any(c.isupper() for c in s))):
        return True
    return False


def build_resume_pdf(resume_text: str) -> str:
    filename = f"{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(GENERATED_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=LETTER,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )

    s_name    = _style_name()
    s_contact = _style_contact()
    s_section = _style_section()
    s_sub     = _style_subheading()
    s_body    = _style_body()
    s_bullet  = _style_bullet()

    lines = resume_text.splitlines()
    story = []
    name_written  = False
    in_header_block = True
    contact_lines = []

    for idx, line in enumerate(lines):
        stripped = line.strip()

        if not stripped:
            if contact_lines:
                story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_lines), s_contact))
                contact_lines = []
            story.append(Spacer(1, 4))
            continue

        if _is_section_header(stripped):
            if contact_lines:
                story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_lines), s_contact))
                contact_lines = []
            in_header_block = False
            story.append(Spacer(1, 4))
            story.append(Paragraph(stripped.upper().rstrip(":"), s_section))
            story.append(HRFlowable(width="100%", thickness=0.5,
                                    color=COLOR_RULE, spaceAfter=4))
            continue

        if in_header_block and not name_written and _is_name_line(stripped, idx):
            story.append(Paragraph(stripped, s_name))
            name_written = True
            continue

        if in_header_block:
            contact_lines.append(stripped)
            continue

        if _is_bullet(stripped):
            clean = stripped.lstrip("•-*●– ").strip()
            story.append(Paragraph(f"&#8226;&nbsp; {clean}", s_bullet))
            continue

        if _is_subheading(stripped):
            story.append(Paragraph(stripped, s_sub))
            continue

        story.append(Paragraph(stripped, s_body))

    if contact_lines:
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_lines), s_contact))

    doc.build(story)
    return filepath
