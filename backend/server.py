from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routes
from routes import contact, newsletter, purchase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database and create indexes
    from database import init_db
    logger.info("Initializing database and creating indexes...")
    await init_db()
    logger.info("Database initialized.")
    yield
    # Shutdown: Close database connection
    from database import close_db_connection
    close_db_connection()
    logger.info("Database connection closed.")

# Create the main app without a prefix
app = FastAPI(title="Likha Home Builders API", version="1.0.0", lifespan=lifespan)

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
        "version": "1.0.0"
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
    app.mount("/carousel", CachedStaticFiles(directory=str(carousel_dir)), name="carousel")

# Configure CORS - Get from environment variable or use defaults
# In production, ALLOWED_ORIGINS should be set in the .env file
# e.g., ALLOWED_ORIGINS=https://yourdomain.com
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)