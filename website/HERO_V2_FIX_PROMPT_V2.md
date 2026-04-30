# HERO V2 — Round 2 Fixes (Scroll Responsiveness + Scene 2 & 3 Rebuild + Performance)

The 5-scene structure is right. Scene 1 (hero) and Scene 5 (final corridor with warm light) are landed — DO NOT TOUCH. The remaining issues are surgical: scroll responsiveness, scene 2 feels empty, scene 3 is broken, and the whole experience needs a performance pass.

---

## Issue 1 — Scroll responsiveness (highest priority)

Right now the user scrolls a lot before anything visibly transitions. The transitions are detached from scroll input. They feel triggered, not driven.

**Fix:**

- Use GSAP ScrollTrigger with `scrub: 0.5` (or `scrub: true` for 1:1) on every scene.
- Each scene's entry animation must START at scroll position 0 of its pinned section. No dead scroll at the top of any section.
- Reduce hold percentage from 60% → 40%. New per-scene budget: 30% scroll-in / 40% hold / 30% scroll-out. More motion per pixel scrolled.
- Verify with the smoothScroll plugin (Lenis) tied to ScrollTrigger.update — scroll should feel buttery, not snappy or laggy.
- Test: grab the scrollbar and drag slowly. The 3D scene should respond immediately and proportionally. If you scroll 50px, you should see ~50px worth of camera movement. If there's a lag or a "nothing happens" zone, the scrub is broken.

---

## Issue 2 — Scene 1 → Scene 2 transition feels disconnected

Currently the hero ends, scroll happens, then scene 2 appears as if from nowhere.

**Fix:**

- Tie the camera dolly directly to scroll. As scroll begins, the hero left-column copy fades out (opacity scrub) AND the camera dollies forward into the staircase simultaneously. Both driven by the same ScrollTrigger.
- The dolly should travel through the staircase, not cut. By scroll position 100% of section 1, the camera is already in the position scene 2 needs.
- No black flash, no fade-to-grey, no momentary blank. Continuous camera path.
- Scene 2's DISCOVERY text fades in during the last 30% of the section 1 scroll-out — it appears WHILE the camera is settling into scene 2's framing, not after.

---

## Issue 3 — Scene 2 (DISCOVERY) is too empty

Currently just stairs + text. No reason for the eye to stay engaged.

**Fix — add intentional content density that reinforces the message:**

The message is "We map every constraint before we draw a line. 147 compliance items · 1 site survey · 1 timeline locked."

Add these as visual layers anchored to the 3D scene (NOT floating UI):

1. **Measurement annotations on the staircase.** Thin orange dimension lines with pixel-snapped tick marks at key points: stair width, landing depth, ceiling height. 3–5 measurement callouts, not more.
2. **Compliance markers** — small numbered hexagonal tags pinned to specific points on the architecture: "01", "02", "03"... up to maybe "12" visible in frame (implying 147 total). Use accent orange. They appear progressively as the camera settles.
3. **Subtle scanning grid** — a faint blueprint-style grid overlaying the staircase floor, fading in as scene 2 establishes. Removes the empty feeling, reinforces "we map".
4. **Ambient light beam** sweeping slowly across the staircase to mimic site survey scanning. Very subtle.

Stagger these in: dimensions first (during scene 2 entry), then compliance tags (during the hold), then grid (background, fades up gently).

Text overlay stays as-is: lower-left, "01 · DISCOVERY", headline, support line.

---

## Issue 4 — Scene 3 (BUILD) is broken

A single cylindrical pillar in a grey void. Doesn't communicate "build" at all.

**Fix — show transformation, not abstraction:**

Composition: a section of the campus interior or exterior with construction-to-finished elements layering in. The camera doesn't move much during the scene — the BUILD happens IN the frame.

Sequence as scroll progresses through scene 3:

1. **Enter:** bare structural shell — wireframe walls, no fixtures, no finishes. Bone-grey.
2. **Mid-hold:** finishes appear in layers, top-down or section-by-section:
   - Wall panels slide in from above
   - Floor tiles tile in from one corner
   - Doors and windows appear with a subtle scale-up
   - Light fixtures snap in and turn on
   - Signage labels appear: "WING A · 12 CLASSROOMS", "WING B · LABS + LIBRARY"
3. **Exit:** the space is fully finished and warmly lit — primed to dolly forward into scene 4.

Keep the text overlay in the same position and style: "02 · BUILD — Fit-out, finish, and certify under one contract." Support line: "4 service pillars · 1 PM · 0 outsourced trades."

Do NOT show the cylindrical pillar. Delete it.

---

## Issue 5 — Scene 4 (HANDOVER) needs the strong DELIVERED composition

Currently the cylinder primitive is leaking here too. Use the proper interior-with-windows shot you had earlier, with:

- Symmetrical interior, two large window walls left and right
- "DELIVERED." in monumental display weight, centered top
- "ON THE DATE IN YOUR CONTRACT." in accent orange, smaller, below
- Small support line lower-left: "03 · HANDOVER — Verified by handover certificates"

This scene's text treatment can be the climax — it's allowed to be larger than scene 2 and 3's overlays. Just make sure it doesn't appear in any other scene's frame.

---

## Issue 6 — Improve Scene 5 (final)

Final frame works (corridor with warm light + green path + door with 2x2 window). Two small additions:

1. **Subtle ambient settle** — once the user reaches the final scroll position, the warm light pulses gently once (a 3-second slow inhale), then settles. Signals "you've arrived."
2. **CTA prompt appears** — fade in a small CTA element after the settle: "Book your 45-min assessment →" with a subtle accent orange background. Click links to the same destination as the hero CTA. This converts the final frame from "end of story" to "next step."
3. Optional: small text above the CTA — "Ready to start?" in muted color.

---

## Issue 7 — Performance pass (do this last, but do it)

Current setup is likely Spline + GSAP + heavy assets. Tighten:

**Asset optimization:**
- Export Spline scene with maximum compression. Target: under 2MB for the 3D bundle.
- If Spline export is over 2MB after compression, migrate to React Three Fiber + GLB export (KTX2 textures). R3F gives you granular control over what loads when.
- All textures: KTX2 or WebP, max 1024x1024 unless absolutely needed larger.
- Geometry: decimate to under 50k tris total across all scenes.

**Loading strategy:**
- Lazy-load the 3D bundle: dynamic import behind a Suspense boundary.
- Show a static hero image (PNG/WebP, ~150KB) as the placeholder — it should match scene 1's framing exactly so the swap to interactive 3D is invisible.
- Preload only scene 1 assets on first paint. Scene 2–5 assets preload during scene 1's hold time (idle).

**Runtime:**
- Tie ScrollTrigger to Lenis for smooth scroll, single rAF loop.
- Pause Spline / R3F render loop when the canvas is fully scrolled out of view (use IntersectionObserver).
- `will-change: transform, opacity` only on the actively animating elements; remove on scene exit.
- Throttle any non-scroll-driven listeners (resize, etc.) with requestAnimationFrame.
- Disable autoplay loops on any video/Lottie elements until they're in viewport.

**Bundle:**
- Split GSAP plugins — only import ScrollTrigger, ScrollSmoother (or Lenis), nothing else.
- Tree-shake Spline runtime if possible; use the lite runtime if available.
- Audit your dependency footprint: target hero JS bundle under 250KB gzipped.

**Lighthouse targets:**
- Performance: 90+ on desktop, 80+ on mobile
- LCP: under 2.5s
- TBT: under 200ms
- CLS: under 0.1

---

## Execution order

1. **Performance audit first.** Run Lighthouse on current hero-v2. Show me the numbers and the heaviest assets. This is the baseline.
2. **Fix scroll responsiveness** (Issue 1). Get scrub feeling 1:1.
3. **Rebuild scene 1 → 2 transition** (Issue 2). Continuous camera dolly.
4. **Add scene 2 content density** (Issue 3). Dimensions, compliance tags, grid, light sweep.
5. **Rebuild scene 3 BUILD** (Issue 4). Layered transformation in-frame.
6. **Fix scene 4 HANDOVER composition** (Issue 5). Proper interior with DELIVERED.
7. **Polish scene 5** (Issue 6). Light pulse + CTA prompt.
8. **Performance pass** (Issue 7). Re-run Lighthouse, hit targets.

After each step, scroll through end-to-end and verify nothing earlier has regressed.

---

## Success test

- Drag scrollbar slowly: 3D scene moves in lockstep with scroll, no dead zones, no lag.
- Scene 2 holds the eye for the full hold duration — measurements, tags, and grid give you reasons to look around.
- Scene 3 visibly TRANSFORMS a space in front of the user — bare → finished. Story is legible without reading the text.
- Scene 5 ends with a clear CTA — user knows what to do next.
- Lighthouse Performance: 90+ desktop, 80+ mobile.
- First paint shows scene 1 within 1.5s on 4G.
