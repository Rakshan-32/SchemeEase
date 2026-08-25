from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

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
    # Gmail SMTP configuration via environment variables
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    admin_email = os.getenv("CONTACT_ADMIN_EMAIL", smtp_username)
    from_email = os.getenv("CONTACT_FROM_EMAIL", smtp_username)

    if not smtp_host or not smtp_username or not smtp_password:
        raise HTTPException(
            status_code=503,
            detail="Email service is not configured. Please contact the administrator."
        )

    try:
        # Send email to administrator with citizen's message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[SchemEase Contact] {request.subject}"
        msg["From"] = from_email
        msg["To"] = admin_email
        # CRITICAL: Set Reply-To so admin can reply directly to citizen
        msg["Reply-To"] = request.email

        body = (
            f"You have received a new enquiry via SchemEase:\n\n"
            f"Name: {request.name}\n"
            f"Email: {request.email}\n"
            f"Subject: {request.subject}\n\n"
            f"Message:\n{request.message}\n\n"
            f"---\n"
            f"To reply, simply click Reply in your email client."
        )
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(from_email, admin_email, msg.as_string())

        # Optionally send acknowledgment to citizen
        try:
            ack_msg = MIMEMultipart("alternative")
            ack_msg["Subject"] = "We received your SchemeEase enquiry"
            ack_msg["From"] = from_email
            ack_msg["To"] = request.email
            ack_msg["Reply-To"] = admin_email

            ack_body = (
                f"Dear {request.name},\n\n"
                f"Thank you for contacting SchemeEase. We have received your enquiry regarding: {request.subject}\n\n"
                f"Our team will review your message and respond as soon as possible.\n\n"
                f"Best regards,\n"
                f"SchemeEase Team"
            )
            ack_msg.attach(MIMEText(ack_body, "plain"))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.sendmail(from_email, request.email, ack_msg.as_string())
        except Exception:
            # Acknowledgment is optional - don't fail if it doesn't send
            pass

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
