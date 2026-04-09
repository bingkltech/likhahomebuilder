## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.

## 2024-05-18 - [Offload high-frequency UI updates to CSS variables]
**Learning:** Updating React state for continuous user interactions (like 3D tilt on mousemove or drag offsets) causes excessive re-renders and can drop frame rates on complex components. Using `useRef` to manipulate CSS variables directly on the DOM element bypasses the React reconciliation cycle, ensuring 60fps performance while keeping the logic inside the component.
**Action:** For interactive components with rapid visual updates, prefer direct DOM manipulation of CSS variables over React state to eliminate re-render bottlenecks.