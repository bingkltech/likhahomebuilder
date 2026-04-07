## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.

## 2026-04-07 - [Automated MongoDB Indexing in FastAPI Startup]
**Learning:** Automating index creation during FastAPI startup ensures consistent performance across environments. However, using deprecated `on_event("startup")` triggers warnings, and index creation (especially unique indexes) must be wrapped in error handling to prevent pre-existing duplicate data from blocking server startup.
**Action:** Implement database initialization within a `lifespan` context manager and use `try...except` blocks for all `create_index` operations.