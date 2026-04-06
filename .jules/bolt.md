## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.
## 2024-06-03 - [Code Split Routes via React.lazy and Suspense]
**Learning:** Initially, loading all page components synchronously caused a bloated initial JavaScript bundle. Using React.lazy for route-level components ensures that users only download the code for the page they are visiting, significantly reducing the initial payload.
**Action:** Always wrap application routes in a Suspense boundary and use React.lazy to dynamically import large page components.
