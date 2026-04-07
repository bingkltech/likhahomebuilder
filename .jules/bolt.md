## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.

## 2024-05-19 - [Route-level Code Splitting]
**Learning:** Implementing route-level code splitting with React.lazy() and Suspense significantly reduces the initial JavaScript bundle size, allowing the browser to load only the code necessary for the initial route. This prevents a monolithic bundle and improves initial load performance (LCP/TTI).
**Action:** Always implement route-level code splitting for page components in React applications using React.lazy() and a standard fallback UI like Suspense with an accessible loading indicator.
