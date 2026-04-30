# HERO V2 FIX — Kill the void frames, collapse to 5 scenes

I reviewed the scroll frame-by-frame. The core problem is not "too many transitions" — it's that the Spline camera is traveling through empty 3D volumes between content beats. At scroll positions ~25%, ~40%, ~45%, ~55%, ~60% the screen is effectively blank (white void, dark blue void, grey void). Those empty transit moments are what reads as the glitch.

Secondary problem: text overlays use different typography, position, and scale every time they appear. There is no system.

---

## Lock these — DO NOT TOUCH

- **Opening frame:** full hero with staircase backdrop, "Our campus. Our distance. Built." headline, eyebrow ("CAMPUS TRANSFORMATION PARTNER"), subhead ("Design, build, fit-out, certify — under one contract, on a date you can sue us for."), both CTAs ("Book a 45-min assessment", "See 50+ handovers"), stats row (50+, 100%, ₹200Cr+).
- **Closing frame:** symmetrical dark building columns with green path leading to warm central light, door with 2x2 window centered.

---

## Cut these content beats entirely

- Floating "NUVEXA · CAMPUS DELIVERY" badge → nav-bar morph (start with the final nav bar in place)
- White flash frame (~12s)
- Dark empty column corridor (~15–17s)
- Pure-void dark blue frame (~20–22s)
- Floating beige "GAP ANALYSIS · 147 ITEMS" card with LIBRARY WING labels
- Pure-void grey frame (~27–30s)
- Green wall filling the viewport (~32s)
- Separate library interior with red bell + podium scene

---

## Rebuild the middle as exactly 3 scenes

### Scene 2 — DISCOVERY
- Camera sits on a staircase view (same backdrop family as hero, different angle).
- One text beat: **"01 · DISCOVERY — We map every constraint before we draw a line."**
- One supporting stat line (e.g., "147 compliance items · 1 site survey · 1 timeline locked").
- Hold still for 60% of the scene's scroll budget.

### Scene 3 — BUILD
- Camera on one interior beat only. Use the "WING A · 12 CLASSROOMS / WING B · LABS + LIBRARY" stair-with-signage composition.
- One text beat: **"02 · BUILD — Fit-out, finish, and certify under one contract."**
- One supporting stat line.
- Hold still for 60%.

### Scene 4 — HANDOVER
- Camera on the interior with **"DELIVERED. ON THE DATE IN YOUR CONTRACT."** composition.
- Hold still for 60%, then transition into the locked closing frame.

---

## Transition rules — the "stair step" feel

- Camera moves only **between** scenes, never during a scene. When a scene is active, the camera is locked.
- Use **ONE transition type** between all 5 scenes — a single Spline camera dolly-forward with a short fade on the incoming text. Do not mix dolly + orbit + zoom. Pick dolly-forward, use it 4 times.
- Each scene gets **equal scroll budget — 20% of total scroll each.** Five equal stair steps.
- Within each scene: 20% scroll transitioning in, 60% held still, 20% transitioning out. No continuous camera drift.
- No element animates without scroll input. Kill any auto-loop, ambient rotation, or floating object motion.

---

## Text overlay system — fix the randomness

Same treatment across all 3 middle scenes:

- **Position:** lower-left (or lower-center — pick one and commit)
- **Eyebrow:** `0N · STAGE NAME` in accent color, small caps, fixed size
- **Headline:** one sentence, display weight, max 70 characters, fixed size
- **Support line:** one stat or one proof point, muted color, fixed size
- DELETE the monumental "DELIVERED." treatment if you can't match the system. Otherwise keep it only for Scene 4 as the designed climax — but it must use the same font family.

---

## Technical

- Drive Spline via GSAP ScrollTrigger `scrub` with 5 discrete camera keyframes (hero, discovery, build, handover, close).
- Camera interpolation only fires in the 20% in / 20% out windows of each scene.
- At the 60% hold within each scene, camera is pinned to an exact transform — no micro-drift.
- Preload the Spline scene before mount; do not stream camera positions on demand.
- One pinned ScrollTrigger section per scene, 5 total.
- Remove every `position: absolute` element that isn't bound to exactly one scene's timeline.
- No `yoyo`, no `repeat`, no `autoplay` timelines anywhere.

---

## Execution order — do not skip

1. **Audit.** Open hero-v2. List every current Spline camera keyframe and every text overlay. Show me the list.
2. **Map.** Mark which keyframes/overlays map to the 3 middle scenes above. Everything else gets deleted.
3. **Wait for approval.**
4. **Rebuild.** 5 camera keyframes total, 3 text overlays total (plus locked hero + locked close).
5. **Scroll-test.** Pause at 10 random positions. Confirm every pause shows either a composed scene or a single-element fade. No voids.

---

## Success test

If I scroll slowly and stop anywhere, I should never see an empty 3D void. That is the bug. Fix it by deleting empty camera travel and replacing it with held composed scenes.
