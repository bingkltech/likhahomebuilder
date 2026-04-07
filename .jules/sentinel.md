## 2024-05-23 - [API Authorization & CORS Security]
**Vulnerability:** Admin endpoints (GET /contact, GET /newsletter, GET /purchase) were publicly accessible, exposing Personally Identifiable Information (PII) of customers and subscribers. Additionally, CORS was configured with `allow_origins=["*"]` while `allow_credentials=True`, which is insecure and often rejected by modern browsers for authenticated requests.
**Learning:** Initial development often focuses on functionality, leaving "admin" endpoints unprotected under the assumption they are "internal" or "hidden". Wildcard CORS is often a default that persists into production.
**Prevention:** Always apply at least a basic API key or Bearer token authentication to any endpoint that returns user data. Use environment variables for CORS origins instead of wildcards.

## 2024-05-23 - [Hardcoded Admin Secret Token]
**Vulnerability:** The `ADMIN_SECRET_TOKEN` environment variable had a hardcoded default fallback (`"default_secret_token_change_me"`) in `backend/auth.py`. If the environment variable was missing, anyone knowing this default string could gain full admin access to the application endpoints.
**Learning:** Default fallbacks for authentication secrets completely undermine the security of environment variables. It's better for the application to fail to start or explicitly return a server error than to silently use a known, insecure secret.
**Prevention:** Always raise an explicit error or fail securely if critical security configuration is missing during initialization or execution, rather than providing fallback credentials.

## 2024-05-23 - [Missing Global Security Headers]
**Vulnerability:** The FastAPI application was missing critical global security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Strict-Transport-Security), leaving it vulnerable to common web attacks like clickjacking and MIME sniffing.
**Learning:** Security headers are often overlooked in API development because they are historically associated with returning HTML pages. However, they provide important defense-in-depth even for JSON endpoints.
**Prevention:** Always implement a global middleware to enforce standard HTTP security headers across all endpoints, regardless of content type.

## 2024-05-23 - [Missing Anti-Caching Headers on API Endpoints]
**Vulnerability:** API responses were missing anti-caching headers, meaning sensitive admin data or user info could be cached by browsers or intermediary proxies.
**Learning:** Static assets need caching, but API endpoints (especially under `/api/`) should explicitly define `no-store` to prevent data leakage.
**Prevention:** Always conditionally apply `Cache-Control: no-store` strictly to API routes in the global security middleware.
