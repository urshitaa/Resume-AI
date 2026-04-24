# import os
# import time
# import requests
# from typing import Optional

# from google import genai

# # =========================
# # CONFIG
# # =========================
# LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# GROK_API_KEY = os.getenv("GROK_API_KEY", "")

# GROK_API_URL = "https://api.x.ai/v1/chat/completions"
# GROK_MODEL = "grok-2-latest"

# GEMINI_MODEL = "gemini-1.5-flash"

# MAX_RETRIES = 2
# RETRY_DELAY = 2
# REQUEST_TIMEOUT = 30


# # =========================
# # GEMINI
# # =========================
# def _generate_gemini(prompt: str) -> str:
#     if not GEMINI_API_KEY:
#         raise ValueError("GEMINI_API_KEY is not set.")

#     genai.configure(api_key=GEMINI_API_KEY)

#     model = genai.GenerativeModel(GEMINI_MODEL)

#     last_exc: Optional[Exception] = None

#     for attempt in range(MAX_RETRIES + 1):
#         try:
#             response = model.generate_content(
#                 prompt,
#                 generation_config={
#                     "temperature": 0.7,
#                     "max_output_tokens": 2048,
#                 },
#             )

#             text = response.text

#             if not text:
#                 raise ValueError("Gemini returned empty response.")

#             return text.strip()

#         except Exception as e:
#             last_exc = e
#             if attempt < MAX_RETRIES:
#                 time.sleep(RETRY_DELAY * (attempt + 1))
#             continue

#     raise RuntimeError(f"Gemini failed after retries: {last_exc}")


# # =========================
# # GROK (xAI)
# # =========================
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
#                 raise ValueError("Grok returned no choices.")

#             content = choices[0]["message"]["content"]

#             if not content:
#                 raise ValueError("Grok returned empty content.")

#             return content.strip()
  
#         except requests.exceptions.Timeout as e:
#             last_exc = e

#         except requests.exceptions.HTTPError as e:
#             last_exc = e
#             if response.status_code not in (429, 500, 502, 503, 504):
#                 raise RuntimeError(f"Grok HTTP error: {e}")

#         except Exception as e:
#             last_exc = e

#         if attempt < MAX_RETRIES:
#             time.sleep(RETRY_DELAY * (attempt + 1))

#     raise RuntimeError(f"Grok failed after retries: {last_exc}")


# # =========================
# # MAIN ENTRY
# # =========================
# def generate_response(prompt: str) -> str:
#     if not prompt or not prompt.strip():
#         raise ValueError("Prompt must not be empty.")

#     if LLM_PROVIDER == "gemini":
#         return _generate_gemini(prompt)

#     elif LLM_PROVIDER == "grok":
#         return _generate_grok(prompt)

#     else:
#         raise ValueError(
#             f"Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'. Use 'gemini' or 'grok'."
#         )

import os
import time
import requests
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai

# =========================
# CONFIG
# =========================
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

# GEMINI_API_KEY = 
# GROK_API_KEY = os.getenv("GROK_API_KEY", "")
# HUGGINGFACE_API_KEY = os.getenv("HF_TOKEN", "")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROK_API_KEY = os.getenv("GROK_API_KEY", "")
HUGGINGFACE_API_KEY = os.getenv("HF_TOKEN", "")

GROK_API_URL = "https://api.x.ai/v1/chat/completions"
GROK_MODEL = "grok-2-latest"

GEMINI_MODEL = "gemini-flash-latest"

MAX_RETRIES = 2
RETRY_DELAY = 2
REQUEST_TIMEOUT = 30


# =========================
# GEMINI (UPDATED SDK)
# =========================
def _generate_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set.")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(GEMINI_MODEL)

    last_exc: Optional[Exception] = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = model.generate_content(prompt)
            print("Gemini response: " ,response)
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
# HUGGING FACE
# =========================
def _generate_hf(prompt: str) -> str:
    if not HUGGINGFACE_API_KEY:
        raise ValueError("HUGGINGFACE_API_KEY is not set.")
    
    url = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
    
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json",
    }
    
    formatted_prompt = f"<|system|>\nYou are an expert career assistant.</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n"
    
    payload = {
        "inputs": formatted_prompt,
        "parameters": {
            "max_new_tokens": 1024,
            "temperature": 0.7,
            "return_full_text": False
        }
    }
    
    last_exc: Optional[Exception] = None
    
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=REQUEST_TIMEOUT,
            )
            response.raise_for_status()
            
            data = response.json()
            if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                content = data[0]["generated_text"]
                return content.strip()
            elif isinstance(data, dict) and "error" in data:
                # If model is loading, wait and retry
                if "is currently loading" in data["error"]:
                    time.sleep(15)
                    continue
                raise ValueError(f"HuggingFace API error: {data['error']}")
            else:
                raise ValueError(f"Unexpected response format from HuggingFace: {data}")
                
        except requests.exceptions.Timeout as e:
            last_exc = e
            
        except requests.exceptions.HTTPError as e:
            last_exc = e
            if response.status_code not in (429, 500, 502, 503, 504):
                raise RuntimeError(f"HuggingFace HTTP error: {e}. Response: {response.text}")
                
        except Exception as e:
            last_exc = e
            
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY * (attempt + 1))
            
    raise RuntimeError(f"HuggingFace failed after retries: {last_exc}")

# =========================
# MAIN ENTRY
# =========================
def generate_response(prompt: str) -> str:
    if not prompt or not prompt.strip():
        raise ValueError("Prompt must not be empty.")

    if LLM_PROVIDER == "gemini":
        try:
            return _generate_gemini(prompt)
        except Exception as e:
            return f"⚠️ **API Error:** The Gemini API key has either exceeded its quota or does not have access to this model. Please check your Google AI Studio billing/plan."

    elif LLM_PROVIDER == "grok":
        try:
            return _generate_grok(prompt)
        except Exception as e:
            return f"⚠️ **API Error:** The Grok API key is incorrect or invalid. Please check your x.ai console."

    elif LLM_PROVIDER == "huggingface":
        try:
            return _generate_hf(prompt)
        except Exception as e:
            return f"⚠️ **API Error:** HuggingFace Inference API failed."

    else:
        return f"⚠️ **Configuration Error:** Unsupported LLM_PROVIDER: '{LLM_PROVIDER}'."

import json

def extract_job_metadata(job_text: str) -> dict:
    """
    Extracts company info and similar jobs from the provided job description text.
    Returns a dictionary with 'company_info' and 'similar_jobs'.
    """
    if not job_text or not job_text.strip():
        return {"company_info": "", "similar_jobs": []}

    prompt = f"""
    You are an expert recruitment assistant. Please extract the following information from the job description below:
    1. Company Info: A brief paragraph describing the company (if available).
    2. Similar Jobs: A list of any similar or related jobs mentioned in the text. Include the title, a brief detail, and a URL if present.

    Return ONLY valid JSON in the exact format below, with no markdown formatting blocks around it:
    {{
      "company_info": "Description of the company here, or empty string if not found.",
      "similar_jobs": [
        {{"title": "Job Title", "details": "Brief detail", "url": "URL or empty string"}}
      ]
    }}

    Job Description:
    {job_text}
    """

    try:
        response_text = generate_response(prompt)
        # Clean up the response in case the LLM wrapped it in markdown json blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        parsed = json.loads(response_text.strip())
        
        # Ensure correct structure
        company_info = parsed.get("company_info", "")
        similar_jobs = parsed.get("similar_jobs", [])
        
        return {
            "company_info": company_info,
            "similar_jobs": similar_jobs
        }
    except Exception as e:
        print(f"Failed to extract job metadata: {e}")
        return {"company_info": "", "similar_jobs": []}
