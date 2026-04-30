# Navigation Menu Fix — Antigravity Prompt

The current nav floats over the hero image with zero backdrop, zero contrast protection, and no visual container. The links (Services, Work, Process, About, Insights) disappear into busy backgrounds — only the orange "Book Discovery Call" CTA survives because it carries its own background. Fix the nav as a system, not a one-off.

---

## CORE PROBLEMS

1. No nav container or backdrop — text floats directly on imagery and loses legibility on any complex hero background.
2. No scroll behavior — the nav looks identical at the top of the page and after scrolling, with no visual feedback that it's anchored.
3. Logo has no protective treatment — depends entirely on whatever's behind it.
4. No active state — user has no idea which page they're on.
5. No defined mobile behavior visible.

---

## REQUIRED FIX — DUAL-STATE NAV

The nav must have two visual states with a smooth transition between them.

### State 1 — Top of page (over hero)

- Transparent background, BUT with a dark gradient scrim from top of viewport down to ~120px (rgba(10, 25, 47, 0.7) at top fading to transparent at bottom). The scrim sits behind the nav so links remain legible regardless of hero imagery.
- Logo: white/light variant (the current "NUVEXA" with the orange accent stays as is, but ensure it has its own subtle text-shadow OR sits inside the scrim).
- Nav links: white text, weight 500, letter-spacing 0.02em, size 15-16px.
- CTA button: keep the orange "Book Discovery Call" — white text, orange (#E8542B or your existing accent) background, 12px vertical / 20px horizontal padding, 6px radius. No change needed.
- Height: 80px.

### State 2 — Scrolled past hero (after ~80px scroll)

- Solid background: deep navy (use the same #0A192F / brand navy from your design system) with a subtle 1px border-bottom in white at 8% opacity.
- Slight backdrop blur (8px) for depth — `backdrop-filter: blur(8px)` with the navy at 92% opacity instead of 100% so a hint of content shows through.
- Logo: same.
- Links: same white, but now sitting cleanly on solid navy.
- CTA: same orange.
- Height: 64px (compresses 16px on scroll for visual feedback).
- Subtle drop shadow: 0 2px 12px rgba(0,0,0,0.15).

### Transition between states

- Use a simple opacity + height transition on the nav background, 200ms ease-out.
- Trigger when scroll position passes 80px from top.
- No janky layout shifts. The nav links and logo stay in the same horizontal position throughout — only the background, height, and shadow change.

---

## NAV LINK BEHAVIOR

### Hover state
- Link color: shift to brand orange on hover.
- Transition: 150ms ease.
- Subtle 2px underline below the link, brand orange, animates from left to right on hover (transform: scaleX 0 to 1, transform-origin: left).

### Active state (current page)
- Link color: brand orange (always, no hover needed).
- Persistent 2px underline below the link in brand orange.

### Spacing
- 32px gap between nav links (currently looks tight).
- 48px gap between the last nav link and the CTA button.

---

## LOGO TREATMENT

- Keep the existing wordmark + arrow accent.
- Ensure logo height is 32px in State 1 and 28px in State 2.
- Logo is always a clickable link to `/` (homepage).
- Add `aria-label="Nuvexa home"` for accessibility.

---

## MOBILE NAV (under 768px)

The current nav has no visible mobile treatment in the screenshot. Build it.

- Hide the nav links + CTA in the inline bar.
- Show a hamburger icon (3 horizontal lines, white, 24px) on the right where the CTA used to be.
- Keep the logo on the left.
- Keep nav height: 64px on mobile.
- Background: solid navy with the same 1px border-bottom and shadow as State 2 (don't bother with the transparent State 1 on mobile — too small to matter and breaks legibility).
- On hamburger tap: full-screen overlay slides in from the right (300ms ease-out).
  - Background: solid navy at 100% opacity.
  - Close icon (X) in the top right.
  - Nav links stacked vertically, centered, 24px font size, 32px gap between items.
  - Below the nav links: the orange "Book Discovery Call" CTA, full width minus 32px side padding, 56px tall, centered.
  - Below the CTA: small contact strip — phone number and email, 14px white at 60% opacity.
- On link tap: overlay closes and navigates.
- Lock body scroll while overlay is open.

---

## ACCESSIBILITY (do not skip)

- Nav uses `<nav role="navigation" aria-label="Main">` wrapper.
- Logo has `aria-label="Nuvexa home"`.
- Mobile hamburger button has `aria-label="Open menu"` (toggles to "Close menu" when open).
- Mobile overlay traps focus when open and restores focus to the hamburger button on close.
- Escape key closes the mobile overlay.
- All links are keyboard-tab accessible with a visible focus ring (orange, 2px outline, 2px offset).

---

## IMPLEMENTATION NOTES

- Use a single Nav component. Do not duplicate desktop and mobile in two separate components.
- Use Tailwind responsive classes (`md:` breakpoint at 768px).
- Use Framer Motion or simple CSS transitions for the State 1 → State 2 swap. CSS is fine — no need to overcomplicate.
- Use IntersectionObserver OR a simple scroll listener with `requestAnimationFrame` throttling for the scroll-past-hero detection. Don't fire setState on every scroll event — that murders performance.

---

## SUCCESS TEST

1. At top of page, hero image is busy — nav links are still legible because of the scrim. Verify on the auditorium hero, the campus aerial hero, any future hero.
2. Scroll down 100px — nav transitions to solid navy with shadow. No layout shift. Logo and links don't jump positions.
3. Hover any link — color shifts to orange, underline animates left-to-right.
4. Resize browser to 375px wide — nav collapses to logo + hamburger. Tap hamburger — full-screen overlay appears with stacked links and the discovery call CTA.
5. Tab through the nav with keyboard — every link and the CTA show a visible orange focus ring.
6. Open mobile overlay, press Escape — overlay closes, focus returns to hamburger.

---

## STOP CONDITION

If the nav background scrim makes the hero feel "weighed down" at the top (too dark a gradient covering too much of the hero), reduce the scrim opacity from 0.7 to 0.5 OR shrink its vertical reach from 120px to 90px. Don't remove it entirely — without it the nav is illegible on busy hero imagery, which is the entire reason for this fix.

---

## SEPARATE ISSUE FLAGGED IN THE SAME SCREENSHOT (not nav, but worth noting)

The hero stats still show "22 schools · 100% on-time · ₹85Cr delivered". The HOMEPAGE_COPY_FINAL_ENFORCEMENT_PROMPT.md had this listed as a non-negotiable replacement to "100+ projects delivered · 100% on-time · 10L+ sq.ft delivered" and it has not been applied. Run that prompt again as a separate task — it should not be bundled into this nav fix.

Also: the screenshot inside the auditorium screen reads "WEETERH RIDGE" (typo). Should be "WESTERN RIDGE". Fix in whatever asset that's coming from.
