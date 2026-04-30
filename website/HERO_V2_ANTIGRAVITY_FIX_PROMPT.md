# HERO V2 — Antigravity (Opus 4.7) Fix Prompt

The last refactor broke the hero. Don't iterate on top of the mess. Revert and simplify.

---

## Step 0 — STOP and revert

Before writing any new code:

1. `git log --oneline -20` on the hero-v2 work
2. Identify the last commit where the hero rendered cleanly (5 distinct scenes, lower-left text overlays, no broken cylinder, no duplicated DELIVERED text, final corridor + warm light intact)
3. `git revert` or `git reset --hard` to that commit
4. Confirm with me that you've reverted to a known-good state before proceeding

If there is no clean commit to revert to, hard-reset HeroWalkthrough.tsx, CameraRig.tsx, and the scene files to the version that produced the 5-scene structure with consistent text system. Do not try to "fix forward" on top of the broken state.

---

## Step 1 — Lock scope. Only these changes are allowed:

**Allowed:**
1. Kill the navy-blink overlay between scenes (delete the component entirely)
2. In CameraRig.tsx, remove the lerp 0.12 smoothing. Drive camera position directly from ScrollTrigger progress along a single Catmull spline through 5 waypoints
3. Wire Lenis to ScrollTrigger.update (it's installed, use it)
4. Swap SceneOperating out as Scene 5. Use the orphaned SceneDiscovery.tsx composition (corridor + warm light + green path + door with 2x2 window) as the new Scene 5. Rename the file to SceneFinal.tsx
5. Build a NEW SceneDiscovery component for Scene 2 with: dimension lines on the staircase, 5–8 hex compliance tags pinned to architecture, faint blueprint grid on floor, slow scanning light beam
6. Rewrite SceneBuild for Scene 3: camera mostly static, in-frame transformation — bare wireframe shell → wall panels slide in → floor tiles tile in → doors and fixtures snap on → lights turn on. Driven by progressRef.
7. Lower-left text overlays only. Same eyebrow + headline + support pattern. Scene 4 (HANDOVER) gets the centered DELIVERED treatment as the only exception.

**NOT allowed (do not touch):**
- Scene 1 hero composition (stairs backdrop, headline, CTAs, stats)
- Scene 5 composition once swapped (corridor + warm light + green path + door)
- Top nav
- Left-column typography or layout

---

## Step 2 — Guardrails

- Single canvas. All 5 scenes render as siblings, gated by visibility based on progress range. No mounting/unmounting between scenes.
- One transition type for all 4 scene transitions: continuous camera dolly along the Catmull spline. No fades to black, no fades to navy, no fades to grey, no flashes.
- Text overlays use opacity scrub tied to the same ScrollTrigger as the camera. No React state-driven fades.
- Each scene gets equal scroll budget (100vh of 500vh total). 30% scroll-in / 40% hold / 30% scroll-out.
- ScrollTrigger scrub: 0.3 stays. Don't change it. The lerp removal is what fixes the lag.

---

## Step 3 — Performance pass (only after scenes work)

- Dynamic import the canvas behind Suspense
- Static hero PNG/WebP placeholder (~150KB) matching Scene 1 framing exactly
- Pause R3F render loop when canvas is fully out of view (IntersectionObserver)
- Compress all GLB exports with KTX2 textures, decimate geometry under 50k tris total
- Target: Lighthouse Performance 90+ desktop, LCP under 2.5s

Run `next build && next start`, audit `/hero-v2`. Show numbers before and after.

---

## Step 4 — STOP CONDITIONS

If after implementing Steps 1 and 2 the hero is still visually broken (overlapping text, missing scenes, broken transitions, wrong final scene), DO NOT iterate further. Report what's broken with screenshots and stop. The user will decide whether to continue or scrap and rebuild fresh.

Hard limit: 3 commits maximum on this fix. If you can't get it right in 3 commits, the architecture is wrong and we need to talk before more code gets written.

---

## Success test

- Drag scrollbar slowly: camera moves in lockstep with scroll, no lag, no dead zones
- 5 distinct scenes visible during scroll, no overlapping text between scenes
- Scene 5 is the corridor + warm light + green path + door (NOT the outdoor archway)
- No navy/grey/black flash anywhere in the scroll
- Lighthouse Performance 90+ on production build

If any of those fail, stop and report. Do not patch further.
