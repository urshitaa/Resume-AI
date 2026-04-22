# # import logging
# # import time
# # import requests
# # import google.generativeai as genai
# # from typing import Optional

# # from app.utils.config import get_settings

# # settings = get_settings()
# # LLM_PROVIDER = settings.llm_provider.lower()
# # GEMINI_API_KEY = settings.gemini_api_key
# # GROK_API_KEY = settings.grok_api_key
# # GROK_API_URL = settings.grok_api_base_url
# # GROK_MODEL = "grok-2-latest"
# # GEMINI_MODEL = "gemini-1.5-flash"

# # MAX_RETRIES = 2
# # RETRY_DELAY = 2  # seconds
# # REQUEST_TIMEOUT = 30  # seconds
# # logger = logging.getLogger(__name__)


# # def _generate_gemini(prompt: str) -> str:
# #     if not GEMINI_API_KEY:
# #         logger.error("Gemini API key missing.")
# #         raise ValueError("GEMINI_API_KEY is not set.")

# #     genai.configure(api_key=GEMINI_API_KEY)
# #     model = genai.GenerativeModel(GEMINI_MODEL)

# #     last_exc: Optional[Exception] = None
# #     for attempt in range(MAX_RETRIES + 1):
# #         try:
# #             response = model.generate_content(
# #                 prompt,
# #                 request_options={"timeout": REQUEST_TIMEOUT},
# #             )
# #             text = response.text
# #             if not text:
# #                 raise ValueError("Gemini returned an empty response.")
# #             return text.strip()
# #         except Exception as e:
# #             last_exc = e
# #             logger.warning("Gemini attempt %s failed: %s", attempt + 1, str(e), exc_info=True)
# #             if attempt < MAX_RETRIES:
# #                 time.sleep(RETRY_DELAY * (attempt + 1))
# #             continue

# #     raise RuntimeError(f"Gemini failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# # def _generate_grok(prompt: str) -> str:
# #     if not GROK_API_KEY:
# #         raise ValueError("GROK_API_KEY is not set.")

# #     headers = {
# #         "Authorization": f"Bearer {GROK_API_KEY}",
# #         "Content-Type": "application/json",
# #     }
# #     payload = {
# #         "model": GROK_MODEL,
# #         "messages": [
# #             {"role": "user", "content": prompt}
# #         ],
# #     }

# #     last_exc: Optional[Exception] = None
# #     for attempt in range(MAX_RETRIES + 1):
# #         try:
# #             response = requests.post(
# #                 GROK_API_URL,
# #                 headers=headers,
# #                 json=payload,
# #                 timeout=REQUEST_TIMEOUT,
# #             )
# #             response.raise_for_status()
# #             data = response.json()

# #             choices = data.get("choices", [])
# #             if not choices:
# #                 raise ValueError("Grok returned no choices in response.")

# #             content = choices[0].get("message", {}).get("content", "")
# #             if not content:
# #                 raise ValueError("Grok returned empty content.")

# #             return content.strip()

# #         except requests.exceptions.Timeout as e:
# #             last_exc = e
# #             logger.warning("Grok timeout attempt %s: %s", attempt + 1, str(e), exc_info=True)
# #             if attempt < MAX_RETRIES:
# #                 time.sleep(RETRY_DELAY * (attempt + 1))
# #             continue

# #         except requests.exceptions.HTTPError as e:
# #             last_exc = e
# #             status_code = e.response.status_code if e.response else None
# #             logger.warning("Grok HTTP error %s: %s", status_code, str(e), exc_info=True)

# #             if status_code in (429, 500, 502, 503, 504):
# #                 if attempt < MAX_RETRIES:
# #                     time.sleep(RETRY_DELAY * (attempt + 1))
# #                 continue
# #             raise RuntimeError(f"Grok HTTP error (non-retryable): {str(e)}")
        
# #         except requests.exceptions.ConnectionError as e:
# #             last_exc = e
# #             logger.warning("Grok connection error attempt %s: %s", attempt + 1, str(e), exc_info=True)
# #             if attempt < MAX_RETRIES:
# #                 time.sleep(RETRY_DELAY * (attempt + 1))
# #             continue

# #         except requests.exceptions.RequestException as e:
# #             last_exc = e
# #             logger.warning("Grok request exception attempt %s: %s", attempt + 1, str(e), exc_info=True)
# #             if attempt < MAX_RETRIES:
# #                 time.sleep(RETRY_DELAY * (attempt + 1))
# #             continue

# #         except Exception as e:
# #             last_exc = e
# #             logger.warning("Grok unexpected error attempt %s: %s", attempt + 1, str(e), exc_info=True)
# #             if attempt < MAX_RETRIES:
# #                 time.sleep(RETRY_DELAY * (attempt + 1))
# #             continue

# #     raise RuntimeError(f"Grok failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# # def generate_response(prompt: str) -> str:
# #     if not prompt or not prompt.strip():
# #         raise ValueError("Prompt must not be empty.")

# #     if LLM_PROVIDER == "gemini":
# #         return _generate_gemini(prompt)
# #     elif LLM_PROVIDER == "grok":
# #         return _generate_grok(prompt)
# #     else:
# #         raise ValueError(f"Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'. Must be 'gemini' or 'grok'.")

# import os
# import time
# import requests
# from typing import Optional
# from google import genai
# from google.genai import types

# LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# GROK_API_KEY = os.getenv("GROK_API_KEY", "")

# GROK_API_URL = "https://api.x.ai/v1/chat/completions"
# GROK_MODEL = "grok-2-latest"
# GEMINI_MODEL = "gemini-1.5-flash"

# MAX_RETRIES = 2
# RETRY_DELAY = 2
# REQUEST_TIMEOUT = 30


# def _generate_gemini(prompt: str) -> str:
#     if not GEMINI_API_KEY:
#         raise ValueError("GEMINI_API_KEY is not set.")

#     client = genai.Client(api_key=GEMINI_API_KEY)

#     last_exc: Optional[Exception] = None
#     for attempt in range(MAX_RETRIES + 1):
#         try:
#             response = client.models.generate_content(
#                 model=GEMINI_MODEL,
#                 contents=prompt,
#                 config=types.GenerateContentConfig(
#                     max_output_tokens=8192,
#                     temperature=0.7,
#                 ),
#             )
#             text = response.text
#             if not text:
#                 raise ValueError("Gemini returned an empty response.")
#             return text.strip()
#         except Exception as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#             continue

#     raise RuntimeError(f"Gemini failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# def _generate_grok(prompt: str) -> str:
#     if not GROK_API_KEY:
#         raise ValueError("GROK_API_KEY is not set.")

#     headers = {
#         "Authorization": f"Bearer {GROK_API_KEY}",
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "model": GROK_MODEL,
#         "messages": [
#             {"role": "user", "content": prompt}
#         ],
#     }

#     last_exc: Optional[Exception] = None
#     for attempt in range(MAX_RETRIES + 1):
#         try:
#             response = requests.post(
#                 GROK_API_URL,
#                 headers=headers,
#                 json=payload,
#                 timeout=REQUEST_TIMEOUT,
#             )
#             response.raise_for_status()
#             data = response.json()

#             choices = data.get("choices", [])
#             if not choices:
#                 raise ValueError("Grok returned no choices in response.")

#             content = choices[0].get("message", {}).get("content", "")
#             if not content:
#                 raise ValueError("Grok returned empty content.")

#             return content.strip()

#         except requests.exceptions.Timeout as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#             continue
#         except requests.exceptions.HTTPError as e:
#             last_exc = e
#             if response.status_code in (429, 500, 502, 503, 504):
#                 if attempt < MAX_RETRIES:
#                     time.sleep(RETRY_DELAY * (attempt + 1))
#                 continue
#             raise RuntimeError(f"Grok HTTP error (non-retryable): {e}")
#         except Exception as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#             continue

#     raise RuntimeError(f"Grok failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# def generate_response(prompt: str) -> str:
#     if not prompt or not prompt.strip():
#         raise ValueError("Prompt must not be empty.")

#     if LLM_PROVIDER == "gemini":
#         return _generate_gemini(prompt)
#     elif LLM_PROVIDER == "grok":
#         return _generate_grok(prompt)
#     else:
#         raise ValueError(f"Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'. Must be 'gemini' or 'grok'.")
# import os
# import time
# import requests
# from typing import Optional
# #from google import genai
# import google.generativeai as genai
# #from google.genai import types
# #from google.genai import types

# LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# GROK_API_KEY = os.getenv("GROK_API_KEY", "")

# GROK_API_URL = "https://api.x.ai/v1/chat/completions"
# GROK_MODEL = "grok-2-latest"
# GEMINI_MODEL = "gemini-1.5-flash"

# MAX_RETRIES = 2
# RETRY_DELAY = 2
# REQUEST_TIMEOUT = 30


# def _generate_gemini(prompt: str) -> str:
#     if not GEMINI_API_KEY:
#         raise ValueError("GEMINI_API_KEY is not set.")

#     client = genai.Client(api_key=GEMINI_API_KEY)

#     last_exc: Optional[Exception] = None
#     for attempt in range(MAX_RETRIES + 1):
#         try:
#             response = client.models.generate_content(
#                 model=GEMINI_MODEL,
#                 contents=prompt,
#                 config=types.GenerateContentConfig(
#                     max_output_tokens=8192,
#                     temperature=0.7,
#                 ),
#             )
#             text = response.text
#             if not text:
#                 raise ValueError("Gemini returned an empty response.")
#             return text.strip()
#         except Exception as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#             continue

#     raise RuntimeError(f"Gemini failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# def _generate_grok(prompt: str) -> str:
#     if not GROK_API_KEY:
#         raise ValueError("GROK_API_KEY is not set.")

#     headers = {
#         "Authorization": f"Bearer {GROK_API_KEY}",
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "model": GROK_MODEL,
#         "messages": [{"role": "user", "content": prompt}],
#     }

#     last_exc: Optional[Exception] = None
#     for attempt in range(MAX_RETRIES + 1):
#         try:
#             response = requests.post(
#                 GROK_API_URL,
#                 headers=headers,
#                 json=payload,
#                 timeout=REQUEST_TIMEOUT,
#             )
#             response.raise_for_status()
#             data = response.json()
#             choices = data.get("choices", [])
#             if not choices:
#                 raise ValueError("Grok returned no choices in response.")
#             content = choices[0].get("message", {}).get("content", "")
#             if not content:
#                 raise ValueError("Grok returned empty content.")
#             return content.strip()
#         except requests.exceptions.Timeout as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#         except requests.exceptions.HTTPError as e:
#             last_exc = e
#             if response.status_code in (429, 500, 502, 503, 504):
#                 if attempt < MAX_RETRIES:
#                     time.sleep(RETRY_DELAY * (attempt + 1))
#             else:
#                 raise RuntimeError(f"Grok HTTP error (non-retryable): {e}")
#         except Exception as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))

#     raise RuntimeError(f"Grok failed after {MAX_RETRIES + 1} attempts: {last_exc}")


# def generate_response(prompt: str) -> str:
#     if not prompt or not prompt.strip():
#         raise ValueError("Prompt must not be empty.")
#     if LLM_PROVIDER == "gemini":
#         return _generate_gemini(prompt)
#     elif LLM_PROVIDER == "grok":
#         return _generate_grok(prompt)
#     else:
#         raise ValueError(f"Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'. Must be 'gemini' or 'grok'.")
import os
import time
import requests
from typing import Optional

import google.generativeai as genai


# =========================
# CONFIG
# =========================
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROK_API_KEY = os.getenv("GROK_API_KEY", "")

GROK_API_URL = "https://api.x.ai/v1/chat/completions"
GROK_MODEL = "grok-2-latest"

GEMINI_MODEL = "gemini-1.5-flash"

MAX_RETRIES = 2
RETRY_DELAY = 2
REQUEST_TIMEOUT = 30


# =========================
# GEMINI
# =========================
def _generate_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set.")

    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel(GEMINI_MODEL)

    last_exc: Optional[Exception] = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 2048,
                },
            )

            text = response.text

            if not text:
                raise ValueError("Gemini returned empty response.")

            return text.strip()

        except Exception as e:
            last_exc = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * (attempt + 1))
            continue

    raise RuntimeError(f"Gemini failed after retries: {last_exc}")


# =========================
# GROK (xAI)
# =========================
def _generate_grok(prompt: str) -> str:
    if not GROK_API_KEY:
        raise ValueError("GROK_API_KEY is not set.")

    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROK_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
    }

    last_exc: Optional[Exception] = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = requests.post(
                GROK_API_URL,
                headers=headers,
                json=payload,
                timeout=REQUEST_TIMEOUT,
            )

            response.raise_for_status()

            data = response.json()
            choices = data.get("choices", [])

            if not choices:
                raise ValueError("Grok returned no choices.")

            content = choices[0]["message"]["content"]

            if not content:
                raise ValueError("Grok returned empty content.")

            return content.strip()
  
        except requests.exceptions.Timeout as e:
            last_exc = e

        except requests.exceptions.HTTPError as e:
            last_exc = e
            if response.status_code not in (429, 500, 502, 503, 504):
                raise RuntimeError(f"Grok HTTP error: {e}")

        except Exception as e:
            last_exc = e

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY * (attempt + 1))

    raise RuntimeError(f"Grok failed after retries: {last_exc}")


# =========================
# MAIN ENTRY
# =========================
def generate_response(prompt: str) -> str:
    if not prompt or not prompt.strip():
        raise ValueError("Prompt must not be empty.")

    if LLM_PROVIDER == "gemini":
        return _generate_gemini(prompt)

    elif LLM_PROVIDER == "grok":
        return _generate_grok(prompt)

    else:
        raise ValueError(
            f"Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'. Use 'gemini' or 'grok'."
        )

