## 2024-05-23 - [API Authorization & CORS Security]
**Vulnerability:** Admin endpoints (GET /contact, GET /newsletter, GET /purchase) were publicly accessible, exposing Personally Identifiable Information (PII) of customers and subscribers. Additionally, CORS was configured with `allow_origins=["*"]` while `allow_credentials=True`, which is insecure and often rejected by modern browsers for authenticated requests.
**Learning:** Initial development often focuses on functionality, leaving "admin" endpoints unprotected under the assumption they are "internal" or "hidden". Wildcard CORS is often a default that persists into production.
**Prevention:** Always apply at least a basic API key or Bearer token authentication to any endpoint that returns user data. Use environment variables for CORS origins instead of wildcards.

## 2024-05-23 - [Hardcoded Admin Secret Token]
**Vulnerability:** The `ADMIN_SECRET_TOKEN` environment variable had a hardcoded default fallback (`"default_secret_token_change_me"`) in `backend/auth.py`. If the environment variable was missing, anyone knowing this default string could gain full admin access to the application endpoints.
**Learning:** Default fallbacks for authentication secrets completely undermine the security of environment variables. It's better for the application to fail to start or explicitly return a server error than to silently use a known, insecure secret.
**Prevention:** Always raise an explicit error or fail securely if critical security configuration is missing during initialization or execution, rather than providing fallback credentials.

## 2024-05-23 - [Missing HTTP Security Headers]
**Vulnerability:** The application was missing basic HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`). This increases the risk of attacks like MIME-sniffing, clickjacking, and cross-site scripting (XSS), and allows for downgrading to HTTP instead of HTTPS.
**Learning:** Frameworks like FastAPI do not include HTTP security headers out-of-the-box by default. They have to be manually added either via middleware or explicitly on each response, which is often forgotten in initial development.
**Prevention:** Implement a global middleware early in the development lifecycle to automatically append security headers to all HTTP responses, providing a baseline layer of defense-in-depth across the entire application.
## 2024-05-23 - [Missing Global Security Headers]
**Vulnerability:** The FastAPI application was missing critical global security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Strict-Transport-Security), leaving it vulnerable to common web attacks like clickjacking and MIME sniffing.
**Learning:** Security headers are often overlooked in API development because they are historically associated with returning HTML pages. However, they provide important defense-in-depth even for JSON endpoints.
**Prevention:** Always implement a global middleware to enforce standard HTTP security headers across all endpoints, regardless of content type.

## 2024-05-23 - [Missing Rate Limiting on Sensitive Endpoints]
**Vulnerability:** The backend endpoints `/api/contact`, `/api/newsletter`, and `/api/purchase` were missing rate limiting. This allowed malicious actors to abuse the endpoints by spamming form submissions, leading to potential Denial of Service (DoS) attacks and filling the database with garbage data.
**Learning:** Publicly accessible endpoints that accept user input and write to a database must always be protected by rate limiting to prevent abuse.
**Prevention:** Implement a rate-limiting middleware globally or on specific routes. Ensure proxy environments are handled correctly by using headers like `X-Forwarded-For` to identify the real client IP.
## 2026-04-09 - Add Anti-Caching Headers for API Routes
**Vulnerability:** Missing anti-caching headers on sensitive API routes (like contact and newsletter submissions).
**Learning:** Browsers and proxy servers can cache sensitive user information if caching is not explicitly disabled on API routes.
**Prevention:** Apply `Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, and `Expires: 0` headers to all endpoints managing sensitive data (e.g., matching `/api/`).
