from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from engine import analyze_profile
from ai_layer import generate_explanation, extract_profile_from_text

# Load environment variables
load_dotenv()

app = FastAPI(title="SchemEase 2.0 API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileRequest(BaseModel):
    profile: Dict[str, Any]
    
class ExplainRequest(BaseModel):
    profile: Dict[str, Any]
    scheme_name: str
    match_status: str
    matched: List[str]
    missing: List[str]
    failed: List[str]

class ExtractRequest(BaseModel):
    text: str

class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str

def load_schemes():
    schemes_path = os.path.join(os.path.dirname(__file__), "schemes.json")
    if not os.path.exists(schemes_path):
        return []
    with open(schemes_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.post("/analyze")
def analyze(request: ProfileRequest):
    try:
        schemes = load_schemes()
        results = analyze_profile(request.profile, schemes)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
def explain(request: ExplainRequest):
    try:
        explanation = generate_explanation(
            request.profile, 
            request.scheme_name, 
            request.match_status, 
            request.matched, 
            request.missing, 
            request.failed
        )
        return {"status": "success", "explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-profile")
def extract_profile(request: ExtractRequest):
    try:
        extracted = extract_profile_from_text(request.text)
        return {"status": "success", "profile": extracted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/contact")
def contact(request: ContactRequest):
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    contact_to = os.getenv("CONTACT_TO_EMAIL", smtp_user)

    if not smtp_host or not smtp_user or not smtp_pass:
        raise HTTPException(
            status_code=503,
            detail="Email service is not configured. Please contact the administrator."
        )

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[SchemEase Contact] {request.subject}"
        msg["From"] = smtp_user
        msg["To"] = contact_to
        msg["Reply-To"] = request.email

        body = (
            f"Name: {request.name}\n"
            f"Email: {request.email}\n"
            f"Subject: {request.subject}\n\n"
            f"Message:\n{request.message}"
        )
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, contact_to, msg.as_string())

        return {"status": "success", "message": "Message sent successfully."}
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=503, detail="Email authentication failed. Please check SMTP credentials.")
    except smtplib.SMTPException as e:
        raise HTTPException(status_code=503, detail=f"Failed to send email: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to send your message. Please try again.")

@app.get("/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    schemes = load_schemes()
    scheme = next((s for s in schemes if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"status": "success", "scheme": scheme}

@app.get("/health")
def health_check():
    return {"status": "ok"}
