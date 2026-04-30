# HERO 3D — FIX PROMPT

The current state has regressed. The middle scenes look like random primitives and the final scene is now just a flat blue door in a black void. Fix everything below. No new scope, no architectural changes — just make the existing 5-scene structure look intentional and detailed.

---

## SCENE 1 (Hero) — Cleanup

- Delete the residual ghost outline of the old "NUVEXA · CAMPUS DELIVERY" floating badge. It must not exist in the DOM at any scroll position.
- Keep staircase backdrop, headline, subhead, CTAs, stats row exactly as is.

---

## SCENE 2 (Discovery) — Add architectural detail

Currently empty. Build this on top of the staircase backdrop (camera dollied slightly forward into Scene 1's set):

- 4 thin orange dimension lines with tick marks pinned to staircase architecture: stair width, riser height, landing depth, ceiling clearance. Each labeled with a numeric value (e.g., "1200mm", "180mm").
- 6 small hex compliance tags numbered 01–06, accent orange, pinned to specific architectural points (corner of landing, stair nosing, handrail base, wall-floor junction). Tags fade in progressively as scroll advances.
- Faint blueprint grid on the floor plane, gridlines spaced at 500mm, fades up to 30% opacity during scene hold.
- A thin warm light beam slowly sweeps left to right across the staircase (mimics site survey scanning), 3-second sweep duration.

Text overlay lower-left (unchanged): "01 · DISCOVERY · We map every constraint before we draw a line. · 147 compliance items · 1 site survey · 1 timeline locked"

---

## SCENE 3 (Build) — Show transformation in-frame

Camera mostly static. As scroll progresses through the scene:

1. **Enter (0–25% scroll):** bare wireframe shell — outline-only walls, exposed floor slab, ceiling grid visible. Bone grey on dark navy.
2. **Build phase (25–75% scroll):**
   - Wall panels slide in from above with a 200ms ease (3 panels, staggered 100ms apart)
   - Floor tiles tile in from one corner outward (12 tiles, 50ms each)
   - Two doors appear with scale 0.9 → 1.0 (200ms each)
   - Window openings fill with frames + glass
   - Two ceiling light fixtures snap in and turn on (warm orange glow at 60% intensity)
   - Two signage labels fade in: "WING A · 12 CLASSROOMS" left, "WING B · LABS + LIBRARY" right
3. **Exit (75–100% scroll):** fully finished interior, warmly lit, primed for camera dolly into Scene 4.

Text overlay lower-left: "02 · BUILD · Fit-out, finish, and certify under one contract. · 4 service pillars · 1 PM · 0 outsourced trades"

---

## SCENE 4 (Handover) — Build the symmetrical interior

Replace any flat-grey-void state with a proper 3D interior:

- Symmetrical room composition: two large window walls (left and right) — each window wall has 3–4 tall vertical windows with warm light streaming through
- Central back wall: matte navy with subtle texture, slight rim light at edges
- Floor: warm wood tone or polished concrete with soft reflection
- Camera centered, slight low angle looking forward
- Visible architectural details: window frames, baseboards, ceiling line

Text overlay centered top: "DELIVERED." in display weight (large, white). Below in accent orange smaller: "ON THE DATE IN YOUR CONTRACT." Lower-left small support: "03 · HANDOVER · Verified by handover certificates"

---

## SCENE 5 (Final) — Rebuild the corridor (CRITICAL)

Currently a basic flat blue door floating in a black void. This has regressed badly. Rebuild as a full corridor scene:

- **Corridor walls:** two parallel dark navy walls receding into the distance (left and right of frame). Walls have visible vertical paneling or pilasters every 1.5m for depth cues. Top of walls catches a slight rim light.
- **Floor:** matte dark surface with a green path runner down the center. Path has slight perspective convergence toward the door.
- **Ceiling:** dark, with 2–3 recessed warm spotlights illuminating the path.
- **Door (centerpiece):** the navy door with 2x2 window pattern, but now properly lit. Warm light spills OUT from behind the door through the windows AND from underneath the door, casting a glow on the floor in front.
- **Background atmosphere:** slight warm haze around the door, falloff from light source. Suggests a transition from dark corridor to bright destination beyond.
- **Optional small details:** a small "EXIT" or "WELCOME" sign above the door in subtle accent orange. Floor reflection of the warm door light.

Text overlay (after a 1-second settle): small CTA prompt fades in below the door: "Ready to start? → Book your 45-min assessment" — clickable, links to same destination as hero CTA.

This scene should feel like the warm, satisfying end of a journey. Currently it feels like an empty asset. Add the corridor depth, the warm light bloom, and the spatial context.

---

## ARCHITECTURE RULES (do not change)

- Single canvas, all 5 scenes render as siblings, gated by visibility tied to scroll progress.
- One transition type only: continuous camera dolly along Catmull spline through 5 waypoints. No fades to navy/grey/black between scenes.
- ScrollTrigger `scrub: 0.3`. NO lerp smoothing in CameraRig.
- Lenis wired to ScrollTrigger.update.
- Each scene = 100vh of 500vh total. 30% scroll-in / 40% hold / 30% scroll-out.
- Text overlays use opacity scrub tied to ScrollTrigger, NOT React state.

---

## STOP CONDITIONS

- 3 commits maximum.
- After commit 3, if Scene 2 still looks empty, Scene 3 still doesn't show transformation, Scene 4 is still a void, OR Scene 5 is still a flat door without corridor depth — STOP. Report with screenshots. Do not patch further.

---

## SUCCESS TEST

Slowly scroll end to end. Verify:
1. No floating ghost badge in Scene 1
2. Scene 2 shows staircase + dimension lines + hex tags + blueprint grid + light sweep
3. Scene 3 visibly transforms a bare shell into a finished space in-frame
4. Scene 4 shows symmetrical interior with windows + warm light + DELIVERED text
5. Scene 5 shows a full corridor with depth, walls, floor path, warm light bloom around the door — NOT a flat door in a void
6. CTA prompt appears in Scene 5 after settle
7. Camera moves continuously through scroll, no flashes
8. Lighthouse Performance 90+ on production build

If any fails — stop and report.
