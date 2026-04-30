# HERO 3D — Antigravity Fix Prompt

The scroll-based 3D hero is still broken. I reviewed the current state. Here's what's wrong and exactly what to fix. Do not iterate beyond this scope.

---

## What's broken right now

1. **Hero (Scene 1):** Old "NUVEXA · CAMPUS DELIVERY" floating badge ghost is STILL bleeding through at top center. Should have been deleted three iterations ago.

2. **Scene 2 (Discovery):** Is a flat composition of two green wall panels on a beige background. Looks like classroom chalkboards. Has nothing to do with "We map every constraint before we draw a line." None of the specified content (dimension lines, hex compliance tags, blueprint grid, scanning light beam) is implemented.

3. **Scene 3 (Build):** Either missing or broken — needs verification.

4. **Scene 4 (Handover):** Is a flat grey void with just floating text. No 3D content at all. The "DELIVERED. ON THE DATE IN YOUR CONTRACT." composition with symmetrical interior + windows is not present.

5. **Scene 5 (Final):** Needs verification — should be the corridor + warm light + green path + door with 2x2 window.

---

## Fix scope — do exactly this, nothing more

### 1. Delete the hero ghost badge
Find and remove every reference to the floating "NUVEXA · CAMPUS DELIVERY" badge component, its container, and any opacity/visibility logic that's leaving a residual outline at the top of the hero. It should not exist in the DOM at any scroll position.

### 2. Rebuild Scene 2 (Discovery)
Replace the green-walls composition entirely. Use the staircase backdrop from Scene 1 (camera dollied slightly forward into it). On top of the 3D, add:
- 3–5 thin orange dimension lines with tick marks anchored to staircase architecture (stair width, landing depth, ceiling height)
- 5–8 small hex tags numbered "01" through "08" pinned to specific points on the architecture, accent orange, fading in progressively as scroll progresses through the scene
- Faint blueprint grid on the floor plane, fades up gently
- Slow horizontal light beam sweeping across the staircase

Text overlay stays lower-left: "01 · DISCOVERY · We map every constraint before we draw a line. · 147 compliance items · 1 site survey · 1 timeline locked"

### 3. Rebuild Scene 3 (Build)
Camera mostly static. In-frame transformation as scroll progresses:
- Enters as bare wireframe shell (grey lines on dark background)
- Wall panels slide in from above
- Floor tiles tile in from one corner
- Doors and windows scale up
- Light fixtures snap in and turn on
- Signage labels appear: "WING A · 12 CLASSROOMS", "WING B · LABS + LIBRARY"

Text overlay lower-left: "02 · BUILD · Fit-out, finish, and certify under one contract. · 4 service pillars · 1 PM · 0 outsourced trades"

### 4. Rebuild Scene 4 (Handover)
Use a symmetrical interior 3D composition: two large window walls (left and right) with warm light streaming in, central back wall as a feature surface. NOT a flat grey void.

Text overlay centered top: "DELIVERED." in display weight. Below in accent orange: "ON THE DATE IN YOUR CONTRACT." Lower-left small support: "03 · HANDOVER · Verified by handover certificates"

### 5. Verify Scene 5 (Final)
Confirm Scene 5 renders the corridor with: two dark column walls left and right, green path leading to warm central light, door with 2x2 window pattern centered. If it shows anything else (outdoor archway, sunrise sky, etc.), swap in the correct composition.

---

## Architecture rules (non-negotiable)

- Single canvas. All 5 scenes render as siblings, gated by visibility tied to scroll progress range.
- One transition type only: continuous camera dolly along a Catmull spline through 5 waypoints. No fades to navy, grey, or black between scenes.
- ScrollTrigger with `scrub: 0.3`. NO lerp smoothing in CameraRig. Position interpolates directly from scroll progress.
- Lenis wired to ScrollTrigger.update for smooth scroll.
- Each scene gets equal scroll budget: 100vh of 500vh total. 30% scroll-in / 40% hold / 30% scroll-out.
- Text overlays use opacity scrub tied to the same ScrollTrigger as the camera. NO React state-driven fades.

---

## Stop conditions

- 3 commits maximum to land this fix.
- After commit 3, if any of Scene 1 ghost / Scene 2 content / Scene 3 transformation / Scene 4 interior / Scene 5 corridor is still broken — STOP. Report what's broken with screenshots. Do not patch further.

---

## Success test

Scroll end to end slowly with the scrollbar. Verify:
- No floating "NUVEXA · CAMPUS DELIVERY" ghost anywhere in Scene 1
- Scene 2 shows the staircase with dimension lines and hex tags, NOT green chalkboard walls
- Scene 3 shows a space being built in front of the camera, NOT a static placeholder
- Scene 4 shows a symmetrical interior with windows and DELIVERED text, NOT a grey void
- Scene 5 shows the corridor with warm light and 2x2 window door
- Camera moves continuously through scroll, no flashes, no dead zones
- Lighthouse Performance 90+ on production build (`next build && next start`)

If all 6 pass — ship it. If not — stop and report.
