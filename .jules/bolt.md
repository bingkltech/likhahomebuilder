## 2024-05-18 - [Add lazy loading to React images]
**Learning:** Adding `loading="lazy"` to images below the fold saves initial bandwidth and improves load time on image-heavy React pages. The `fetchpriority="high"` and `loading="eager"` can be used on the hero/LCP image above the fold for maximum speed.
**Action:** Always add `loading="lazy"` for unoptimized remote images that are not immediately visible on page load.

## 2025-05-15 - [Optimize high-frequency UI interactions with CSS variables]
**Learning:** Replacing high-frequency React state (like mouse position or drag offsets) with direct DOM manipulation of CSS variables (`setProperty`) eliminates the React reconciliation and render cycle overhead for every frame of interaction. This significantly improves frame rates for 3D tilts and drag effects.
**Action:** Use `useRef` and `style.setProperty('--var', value)` for mouse-driven or touch-driven animations instead of `useState`.

## 2025-05-15 - [Hoist static data outside React components]
**Learning:** Large static arrays or objects defined inside a functional component are re-allocated on every render, which increases garbage collection pressure and prevents React from easily determining if children (like those wrapped in `React.memo`) need to re-render due to prop reference changes.
**Action:** Always define static data (projects, carousel images, FAQs) at the module level (outside the component function) and use UPPER_CASE naming for these constants.
