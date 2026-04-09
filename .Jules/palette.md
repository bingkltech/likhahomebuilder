## 2024-05-24 - Missing ARIA labels on Icon-only Buttons
**Learning:** Found a pattern of missing `aria-label` attributes on icon-only interactive elements (like the mobile menu button in `Header.jsx` and social media links in `Footer.jsx`). These elements are inaccessible to screen readers without proper labels.
**Action:** Always verify that buttons and links containing only icons include an explicit `aria-label` attribute to ensure accessibility.

## 2024-05-25 - Carousel Accessibility and Keyboard Interaction
**Learning:** Hiding carousel navigation controls until hover completely prevents keyboard users from discovering and using them. Additionally, static `div` indicator dots deny random access to specific slides, forcing users to click through sequentially.
**Action:** Always ensure that interactive elements (like carousel arrows) are visible and focusable using keyboard navigation (e.g., `focus-visible:opacity-100`). Furthermore, make visual indicators interactive, transforming them into `button` elements with proper `aria-label` and focus styling, allowing users direct access to content.

## 2024-05-23 - Carousel Mobile & Auto-Play Enhancements
**Learning:** Carousels on mobile that rely solely on small navigation arrows provide a poor UX, as users naturally expect to swipe between images. Additionally, static carousels without auto-play can cause users to miss out on content hidden behind the first slide. Auto-play needs to pause on hover/focus to remain accessible.
**Action:** Always implement touch event handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`) for swipe gestures on carousels to improve mobile UX. Introduce auto-play with a `setInterval` to encourage discovery, but strictly ensure the interval is cleared when the carousel is hovered or focused to respect user control and accessibility guidelines.

## 2024-05-26 - Form Inputs Lacking Explicit Labels or ARIA Attributes
**Learning:** Found cases where form inputs lacked explicit `<label>` association via `htmlFor`/`id` pairs, or standalone inputs like a newsletter email field missed an `aria-label`. This makes it difficult or impossible for screen reader users to identify the purpose of the input.
**Action:** Always explicitly link a visible `<label>` to an input using `htmlFor` and `id`. If an input does not have a visible label (e.g., a newsletter sign-up with just a placeholder), provide an `aria-label` attribute to ensure the purpose is clear to assistive technologies.

## 2024-05-27 - Missing Loading States on Async Submit Buttons
**Learning:** Found instances where buttons triggering asynchronous operations (like form submissions or newsletter sign-ups) lacked a clear, active visual indicator (such as a spinning icon) alongside the "Loading..." text. While the button was disabled, the absence of an animated indicator reduces user confidence that the system is actively processing their request, potentially leading to confusion or frustration.
**Action:** Use a combination of a descriptive text change (e.g., "Sending...") and an animated visual indicator (like the `Loader2` component from `lucide-react` with a spinning animation) on buttons during async operations. This clearly signals system status and provides a better UX.

## 2024-05-28 - Custom Interactive Element Focus States
**Learning:** Standard browsers may obscure or completely remove default focus states when custom styles (like background colors, border radii, or complex layouts) are applied to interactive elements (e.g., icon-only social media links). Without a visual focus indicator, these elements become inaccessible to keyboard users navigating the site.
**Action:** Always explicitly apply high-contrast focus indicators using Tailwind classes (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black`) to guarantee keyboard accessibility on custom-styled interactive elements.

## 2026-04-09 - 3D Image Carousel Keyboard Accessibility
**Learning:** Custom interactive components like 3D carousels that use non-interactive elements (e.g., div tags) inherently lack keyboard support. This restricts users from navigating the carousel or triggering the lightbox.
**Action:** Explicitly manage keyboard accessibility for custom components by adding semantic roles (`role="button"`), context-aware `aria-label`s, dynamic `tabIndex` management to ensure only visible items receive focus, and mapping `Enter` and `Space` keydown events to the `onClick` action.
