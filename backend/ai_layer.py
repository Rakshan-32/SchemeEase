import os
import json
import google.generativeai as genai
from typing import Dict, Any, List

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return None
    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    return genai.GenerativeModel(model_name)

def generate_explanation(profile: Dict[str, Any], scheme_name: str, match_status: str, matched: List[str], missing: List[str], failed: List[str]) -> str:
    """
    Optional AI enhancement to explain why a scheme matched in natural language.
    If AI fails or is not configured, returns a deterministic fallback string.
    """
    model = init_gemini()
    
    # Deterministic fallback
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
    
    if not model:
        return deterministic_fallback
        
    prompt = f"""
    Explain to the user why they {match_status.lower()} for the '{scheme_name}' scheme in 1-2 friendly, concise sentences.
    Their profile matched: {', '.join(matched) if matched else 'none'}
    They are missing: {', '.join(missing) if missing else 'none'}
    They failed: {', '.join(failed) if failed else 'none'}
    Do not use generic AI intro phrasing. Be direct and helpful.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return deterministic_fallback

def extract_profile_from_text(text: str) -> Dict[str, Any]:
    """
    Extracts structured profile data from a natural language search query.
    Fallback: returns an empty dict if AI fails.
    """
    model = init_gemini()
    if not model:
        return {}
        
    prompt = f"""
    Extract the user profile from this text and return ONLY a valid JSON object.
    Possible fields: age (int), gender (string), income (int), farmer (bool), landholding (bool), socialCategory (string like SC/ST/General), disability (bool), studentStatus (string), employmentStatus (string), ruralUrban (Rural/Urban).
    Text: "{text}"
    Do not include markdown blocks, just the raw JSON. If no fields found, return {{}}.
    """
    
    try:
        response = model.generate_content(prompt)
        raw_json = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return json.loads(raw_json)
    except Exception:
        return {}
