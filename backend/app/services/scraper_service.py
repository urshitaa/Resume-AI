import logging
import re
import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)
TIMEOUT = 10
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
}
REMOVE_TAGS = {"script", "style", "noscript", "nav", "footer", "header", "aside", "iframe"}


def _fetch_html(url: str) -> str:
    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        return response.text
    except requests.exceptions.MissingSchema:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid URL format.",
        )
    except requests.exceptions.InvalidURL:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid URL.",
        )
    except requests.exceptions.ConnectionError as e:
        logger.warning("Scrape connection error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not connect to the provided URL.",
        )
    except requests.exceptions.Timeout as e:
        logger.warning("Scrape timeout: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Request to the URL timed out.",
        )
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code if e.response else None
        logger.warning("Scrape HTTP error %s: %s", status_code, str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Remote server returned an error: {status_code}.",
        )
    except requests.exceptions.RequestException as e:
        logger.warning("Scrape request exception: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to fetch URL: {str(e)}",
        )


def _clean_text(raw: str) -> str:
    text = re.sub(r"[ \t]+", " ", raw)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def scrape_job_description(url: str) -> str:
    # First, try using Jina Reader API which renders JS and bypasses basic anti-bot screens
    jina_url = f"https://r.jina.ai/{url}"
    jina_headers = {
        "User-Agent": HEADERS["User-Agent"],
        "Accept": "text/plain"
    }
    try:
        response = requests.get(jina_url, headers=jina_headers, timeout=15)
        response.raise_for_status()
        text = response.text
        # Jina returns markdown. If the text seems decent, use it.
        if len(text) > 100:
            return _clean_text(text)
    except Exception as e:
        logger.warning(f"Jina scrape failed, falling back to direct request: {str(e)}")

    # Fallback to direct HTML fetching
    html = _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup.find_all(REMOVE_TAGS):
        tag.decompose()

    text = soup.get_text(separator="\n")
    return _clean_text(text)
