## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.
## 2024-05-24 - React Code Splitting for Routes
**Learning:** For SPAs with heavy entry points (like a large HomePage), bundling everything in `App.js` causes poor Time to Interactive and Largest Contentful Paint metrics due to the main bundle size.
**Action:** Use `React.lazy` and `Suspense` for route-level code splitting to defer loading of non-critical route components.
