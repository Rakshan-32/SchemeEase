import os
import json
from google import genai
from google.genai import types
from typing import Dict, Any, List

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return None, None
    client = genai.Client(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    return client, model_name

def generate_explanation(profile: Dict[str, Any], scheme_name: str, match_status: str, matched: List[str], missing: List[str], failed: List[str]) -> str:
    """
    Optional AI enhancement to explain why a scheme matched in natural language.
    If AI fails or is not configured, returns a deterministic fallback string.
    """
    fallback_parts = []
    if match_status == "ELIGIBLE":
        fallback_parts.append("You are eligible for this scheme.")
    elif match_status == "NEEDS_MORE_INFO":
        fallback_parts.append("We need more information to confirm eligibility.")
    else:
        fallback_parts.append("You are not eligible for this scheme.")
    if matched: fallback_parts.append(f"Matched criteria: {', '.join(matched)}.")
    if missing: fallback_parts.append(f"Missing information: {', '.join(missing)}.")
    if failed: fallback_parts.append(f"Unmet criteria: {', '.join(failed)}.")
    deterministic_fallback = " ".join(fallback_parts)

    client, model_name = init_gemini()
    if not client:
        return deterministic_fallback

    prompt = (
        f"Explain to the user why they {match_status.lower()} for the '{scheme_name}' scheme "
        f"in 1-2 friendly, concise sentences. "
        f"Their profile matched: {', '.join(matched) if matched else 'none'}. "
        f"They are missing: {', '.join(missing) if missing else 'none'}. "
        f"They failed: {', '.join(failed) if failed else 'none'}. "
        f"Do not use generic AI intro phrasing. Be direct and helpful."
    )
    try:
        response = client.models.generate_content(model=model_name, contents=prompt)
        return response.text.strip()
    except Exception:
        return deterministic_fallback

def extract_profile_from_text(text: str) -> Dict[str, Any]:
    """
    Extracts structured profile data from a natural language search query.
    Fallback: returns an empty dict if AI fails or is not configured.
    """
    client, model_name = init_gemini()
    if not client:
        return {}

    prompt = (
        f"Extract the user profile from this text and return ONLY a valid JSON object. "
        f"Possible fields: age (int), gender (string), income (int), farmer (bool), "
        f"landholding (bool), socialCategory (string like SC/ST/General/OBC), "
        f"disability (bool), studentStatus (string), ruralUrban (Rural/Urban), "
        f"indianCitizen (bool), poorHousehold (bool), unorganisedWorker (bool). "
        f'Text: "{text}" '
        f"Do not include markdown blocks, just the raw JSON. If no fields found, return {{}}."
    )
    try:
        response = client.models.generate_content(model=model_name, contents=prompt)
        raw_json = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(raw_json)
    except Exception:
        return {}
