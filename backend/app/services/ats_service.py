import re
from typing import Any
import math
from collections import Counter

# ---------------------------------------------------------------------------
# Stop words (simple list for basic NLP tasks)
# ---------------------------------------------------------------------------
STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
    "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
    "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself",
    "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of",
    "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
    "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
    "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
    "you've", "your", "yours", "yourself", "yourselves"
}

# ---------------------------------------------------------------------------
# Curated skill taxonomy (extend as needed)
# ---------------------------------------------------------------------------
KNOWN_SKILLS: set[str] = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "kotlin", "swift", "ruby", "php", "scala", "r", "matlab",
    # Web / frameworks
    "react", "angular", "vue", "node", "nodejs", "django", "flask", "fastapi",
    "spring", "express", "next.js", "nuxt",
    # Data / ML
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "sql", "nosql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform",
    "ansible", "jenkins", "github actions",
    # General
    "rest", "graphql", "microservices", "agile", "scrum", "git",
    "linux", "bash", "excel", "tableau", "power bi",
    # Soft skills
    "leadership", "communication", "teamwork", "problem solving",
    "project management", "time management",
}

# Patterns for experience detection
_EXPERIENCE_PATTERNS = [
    re.compile(r"(\d+)\+?\s*years?\s+of\s+experience", re.IGNORECASE),
    re.compile(r"(\d+)\+?\s*years?\s+experience", re.IGNORECASE),
    re.compile(r"experience\s+of\s+(\d+)\+?\s*years?", re.IGNORECASE),
]

# Formatting quality signals
_FORMAT_POSITIVE = [
    re.compile(r"\b(summary|objective|profile)\b", re.IGNORECASE),
    re.compile(r"\b(experience|work history|employment)\b", re.IGNORECASE),
    re.compile(r"\b(education|qualification)\b", re.IGNORECASE),
    re.compile(r"\b(skills|competencies|technologies)\b", re.IGNORECASE),
    re.compile(r"\b(projects?|portfolio)\b", re.IGNORECASE),
    re.compile(r"\b(certifications?|awards?|achievements?)\b", re.IGNORECASE),
    re.compile(r"\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b", re.IGNORECASE),   # email
    re.compile(r"\b(\+?\d[\d\s\-().]{7,})\b"),                        # phone
]


# ---------------------------------------------------------------------------
# Individual scoring components
# ---------------------------------------------------------------------------

def _get_tf(text: str) -> dict[str, float]:
    tokens = [t for t in re.split(r'\W+', text.lower()) if t and t not in STOP_WORDS]
    count = Counter(tokens)
    total = sum(count.values())
    if not total:
        return {}
    return {k: v / total for k, v in count.items()}

def _score_semantic(resume_text: str, job_text: str) -> float:
    """Lightweight TF-style cosine similarity → 0-100."""
    tf_r = _get_tf(resume_text)
    tf_j = _get_tf(job_text)
    
    intersection = set(tf_r.keys()) & set(tf_j.keys())
    if not intersection:
        return 0.0
        
    dot_product = sum(tf_r[term] * tf_j[term] for term in intersection)
    mag_r = math.sqrt(sum(val**2 for val in tf_r.values()))
    mag_j = math.sqrt(sum(val**2 for val in tf_j.values()))
    
    if mag_r == 0 or mag_j == 0:
        return 0.0
    
    similarity = dot_product / (mag_r * mag_j)
    return round(max(0.0, min(similarity, 1.0)) * 100, 2)


def _extract_skills(text: str) -> set[str]:
    """Extract skills via simple regex lookup over known vocabulary."""
    found: set[str] = set()
    text_lower = text.lower()
    
    for skill in KNOWN_SKILLS:
        # Avoid word boundaries (\b) because some skills contain non-word characters like C++, C#
        # Use negative lookarounds to ensure it's not surrounded by alphanumeric characters
        escaped_skill = re.escape(skill)
        pattern = r'(?<![a-zA-Z0-9])' + escaped_skill + r'(?![a-zA-Z0-9])'
        
        if re.search(pattern, text_lower):
            found.add(skill)

    return found


def _score_skills(resume_text: str, job_text: str) -> tuple[float, list[str], list[str]]:
    """Skills overlap score → 0-100, plus matched/missing lists."""
    resume_skills = _extract_skills(resume_text)
    job_skills = _extract_skills(job_text)

    if not job_skills:
        return 50.0, list(resume_skills), []

    matched = resume_skills & job_skills
    missing = job_skills - resume_skills

    score = round(len(matched) / len(job_skills) * 100, 2)
    return score, sorted(matched), sorted(missing)


def _score_keywords(resume_text: str, job_text: str) -> tuple[float, list[str]]:
    """Simple TF-style keyword overlap on meaningful tokens → 0-100."""
    def _keywords(text: str) -> set[str]:
        return {
            t for t in re.split(r'\W+', text.lower())
            if t and t not in STOP_WORDS and len(t) > 2
        }

    resume_kw = _keywords(resume_text)
    job_kw = _keywords(job_text)

    if not job_kw:
        return 50.0, []

    matched = resume_kw & job_kw
    score = round(len(matched) / len(job_kw) * 100, 2)
    return min(score, 100.0), sorted(matched)


def _score_experience(resume_text: str, job_text: str) -> float:
    """
    Compare required years (from job) vs claimed years (from resume).
    Returns 0-100.
    """
    def _extract_years(text: str) -> float | None:
        for pattern in _EXPERIENCE_PATTERNS:
            match = pattern.search(text)
            if match:
                return float(match.group(1))
        return None

    required = _extract_years(job_text)
    claimed = _extract_years(resume_text)

    if required is None and claimed is None:
        return 70.0   # can't determine — neutral
    if required is None:
        return 80.0   # job doesn't specify — slight boost
    if claimed is None:
        return 40.0   # resume doesn't mention years

    if claimed >= required:
        return 100.0
    ratio = claimed / required
    return round(ratio * 100, 2)


def _score_formatting(resume_text: str) -> float:
    """Check for key resume sections and contact info → 0-100."""
    hits = sum(1 for pattern in _FORMAT_POSITIVE if pattern.search(resume_text))
    return round(hits / len(_FORMAT_POSITIVE) * 100, 2)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def compute_ats_score(resume_text: str, job_text: str) -> dict[str, Any]:
    """
    Run all scoring components and return the combined ATS result dict
    expected by the frontend.
    """
    semantic = _score_semantic(resume_text, job_text)
    skills_score, matched_skills, missing_skills = _score_skills(resume_text, job_text)
    keyword_score, matched_keywords = _score_keywords(resume_text, job_text)
    experience_score = _score_experience(resume_text, job_text)
    formatting_score = _score_formatting(resume_text)

    # Weighted composite
    ats_score = round(
        semantic       * 0.40
        + skills_score   * 0.25
        + keyword_score  * 0.15
        + experience_score * 0.10
        + formatting_score * 0.10,
        1,
    )

    return {
        "ats_score": int(round(ats_score)),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "section_scores": {
            "semantic": semantic,
            "skills": skills_score,
            "keywords": keyword_score,
            "experience": experience_score,
            "formatting": formatting_score,
        },
        "suggestions": ["Consider adding missing skills: " + ", ".join(missing_skills[:5])] if missing_skills else ["Great job! Your skills match well."],
        "explanation": _recommendation(int(round(ats_score))),
    }


def _recommendation(score: int) -> str:
    if score >= 80:
        return "Strong match. Your resume aligns well with this job description."
    if score >= 60:
        return "Moderate match. Consider adding missing skills and relevant keywords."
    if score >= 40:
        return "Weak match. Significant gaps detected. Tailor your resume further."
    return "Poor match. Your resume needs major improvements to fit this role."
