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

## 2025-04-08 - [Missing Anti-Caching Headers for API Endpoints]
**Vulnerability:** The application did not apply anti-caching headers (Cache-Control: no-store, Pragma: no-cache, Expires: 0) to API responses, allowing sensitive JSON data to potentially be cached by intermediate proxies, CDNs, or local browsers.
**Learning:** Security middleware often focuses on headers like XSS-Protection and CSP but forgets that JSON responses containing PII must not be cached. This creates a risk of sensitive data exposure on shared computers or misconfigured proxies.
**Prevention:** Always implement conditional anti-caching headers specifically for API routes (e.g. starting with `/api/`) to protect sensitive data while continuing to allow static asset caching.
