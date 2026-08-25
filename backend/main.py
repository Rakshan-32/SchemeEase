from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
from dotenv import load_dotenv
import resend

from engine import analyze_profile

# Load environment variables
load_dotenv()

app = FastAPI(title="SchemEase 2.0 API")

# Setup CORS
allowed_origins = os.getenv("FRONTEND_URL", "").split(",") if os.getenv("FRONTEND_URL") else [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileRequest(BaseModel):
    profile: Dict[str, Any]

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

@app.post("/contact")
def contact(request: ContactRequest):
    # Resend API configuration via environment variables
    resend_api_key = os.getenv("RESEND_API_KEY", "")
    admin_email = os.getenv("CONTACT_ADMIN_EMAIL", "")
    from_email = os.getenv("CONTACT_FROM_EMAIL", "noreply@resend.dev")

    if not resend_api_key:
        raise HTTPException(
            status_code=503,
            detail="Email service is not configured. Please contact the administrator."
        )

    if not admin_email:
        raise HTTPException(
            status_code=503,
            detail="Admin email is not configured. Please contact the administrator."
        )

    try:
        # Initialize Resend with API key
        resend.api_key = resend_api_key

        # Send email to administrator with citizen's message
        body_text = (
            f"You have received a new enquiry via SchemEase:\n\n"
            f"Name: {request.name}\n"
            f"Email: {request.email}\n"
            f"Subject: {request.subject}\n\n"
            f"Message:\n{request.message}\n\n"
            f"---\n"
            f"To reply, simply click Reply in your email client."
        )

        params = {
            "from": from_email,
            "to": [admin_email],
            "subject": f"[SchemEase Contact] {request.subject}",
            "text": body_text,
            "reply_to": request.email,  # CRITICAL: Set Reply-To so admin can reply directly
        }

        email = resend.Emails.send(params)

        # Optionally send acknowledgment to citizen
        try:
            ack_body = (
                f"Dear {request.name},\n\n"
                f"Thank you for contacting SchemeEase. We have received your enquiry regarding: {request.subject}\n\n"
                f"Our team will review your message and respond as soon as possible.\n\n"
                f"Best regards,\n"
                f"SchemeEase Team"
            )

            ack_params = {
                "from": from_email,
                "to": [request.email],
                "subject": "We received your SchemeEase enquiry",
                "text": ack_body,
                "reply_to": admin_email,
            }

            resend.Emails.send(ack_params)
        except Exception:
            # Acknowledgment is optional - don't fail if it doesn't send
            pass

        return {"status": "success", "message": "Message sent successfully."}
    except Exception as e:
        error_msg = str(e)
        if "API" in error_msg or "api_key" in error_msg.lower():
            raise HTTPException(status_code=503, detail="Email service configuration error.")
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

# ── Production SPA fallback ────────────────────────────────────────────────────
# Serve the React build from ../frontend/dist when it exists.
# Any request that doesn't match an API route gets index.html so that
# client-side routes like /schemes/:id work after a hard refresh.
_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        index = os.path.join(_DIST, "index.html")
        if os.path.isfile(index):
            return FileResponse(index)
        raise HTTPException(status_code=404, detail="Frontend build not found")
