import os
import secrets
from fastapi import Header, HTTPException, status
import logging

logger = logging.getLogger(__name__)


def verify_admin_token(x_admin_token: str = Header(None)):
    """
    Verify the admin token provided in the X-Admin-Token header.
    Uses secrets.compare_digest to prevent timing attacks.
    """
    admin_token = os.getenv("ADMIN_SECRET_TOKEN")

    # 🛡️ Sentinel: CRITICAL SECURITY FIX - Prevent fallback to hardcoded default secret
    if not admin_token:
        logger.error(
            "CRITICAL SECURITY: ADMIN_SECRET_TOKEN is missing in the environment."
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error",
        )

    if not x_admin_token or not secrets.compare_digest(x_admin_token, admin_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid or missing admin token",
        )
    return x_admin_token
