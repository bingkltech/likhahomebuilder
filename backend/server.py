from fastapi import FastAPI, APIRouter, Request
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import os
import logging
from pathlib import Path

# Import routes
from routes import contact, newsletter, purchase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

# Create the main app without a prefix
app = FastAPI(title="Likha Home Builders API", version="1.0.0")

from collections import defaultdict
import time
from fastapi.responses import JSONResponse

# Simple rate limit: 5 requests per minute per IP for sensitive POST endpoints
RATE_LIMIT = 5
RATE_LIMIT_PERIOD = 60
ip_tracker = defaultdict(list)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "POST" and request.url.path in ["/api/contact", "/api/newsletter", "/api/purchase"]:
            # Prevent IP spoofing by ignoring x-forwarded-for unless configured behind a known trusted proxy.
            # Using the actual connection IP is safer for basic rate limiting.
            client_ip = request.client.host if request.client else "unknown"

            current_time = time.time()

            # Clean up old timestamps for this IP
            ip_tracker[client_ip] = [t for t in ip_tracker.get(client_ip, []) if current_time - t < RATE_LIMIT_PERIOD]

            if len(ip_tracker[client_ip]) >= RATE_LIMIT:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."}
                )

            ip_tracker[client_ip].append(current_time)

            # Periodically clean up empty IP entries to prevent memory leaks from many unique IPs
            # Only do this occasionally to avoid performance hits on every request
            if len(ip_tracker) > 1000:
                keys_to_delete = []
                for ip, timestamps in ip_tracker.items():
                    # Filter out old timestamps for all IPs
                    ip_tracker[ip] = [t for t in timestamps if current_time - t < RATE_LIMIT_PERIOD]
                    if not ip_tracker[ip]:
                        keys_to_delete.append(ip)
                for key in keys_to_delete:
                    del ip_tracker[key]

        return await call_next(request)

app.add_middleware(RateLimitMiddleware)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Health check endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Likha Home Builders API",
        "status": "active",
        "version": "1.0.0",
    }


# Include routers
api_router.include_router(contact.router)
api_router.include_router(newsletter.router)
api_router.include_router(purchase.router)

# Include the router in the main app
app.include_router(api_router)

from starlette.responses import Response


class CachedStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: dict) -> Response:
        response = await super().get_response(path, scope)
        if response.status_code == 200:
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response


# Mount static files for carousel images
carousel_dir = ROOT_DIR.parent / "frontend" / "public" / "carousel"
if carousel_dir.exists():
    app.mount(
        "/carousel", CachedStaticFiles(directory=str(carousel_dir)), name="carousel"
    )

# Configure CORS - Get from environment variable or use defaults
# In production, ALLOWED_ORIGINS should be set in the .env file
# e.g., ALLOWED_ORIGINS=https://yourdomain.com
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
)
allowed_origins = [
    origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# 🛡️ Sentinel: Add security headers to all responses
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    return response


# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    from database import close_db_connection

    close_db_connection()
