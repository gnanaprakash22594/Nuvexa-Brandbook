# HERO V1 — Build the Institution Selector (Option B)

Keep Hero-v1's left column exactly as it is. Replace the right-column stacked-blocks placeholder with an interactive institution selector: a single 3D model area + a chip selector below it. Visitor clicks a chip → the model swaps to that institution type → stats row updates to that vertical's numbers.

This component does double work: demonstrates breadth across 4–5 verticals in one component, and self-segments visitors by their click — that click is a behavioral signal worth capturing.

---

## What to keep — DO NOT TOUCH

- Top nav (logo, Services, Work, Process, About, Insights, Get Assessment)
- Eyebrow: "CAMPUS TRANSFORMATION PARTNER"
- Headline: "Your campus. Built once. Built right."
- Subhead: "Design, build, fit-out, certify — under one contract, on a date you can sue us for."
- Both CTAs: "Book a 45-min assessment" + "See our 50+ handovers"
- Stats row layout (numbers will become dynamic per vertical — see below)
- Left-column proportions, typography, spacing

## What to delete

- The current stacked-blocks 3D placeholder
- Any auto-rotation that feels mechanical or screensaver-like
- No scroll-driven camera movement (this is a hero, not a scroll story)

---

## Institution types (chips)

Four chips. Default to K-12. Order left → right:

1. **K-12** — Multi-storey block + playground + assembly hall
2. **Early Ed** — Single-storey, soft geometry, courtyard, low fence
3. **Higher Ed** — University: lecture block + library tower + quadrangle
4. **Healthcare** — Hospital block + OPD wing + ambulance bay

(Skip Corporate Campus for v1 unless we have real delivery proof for it.)

If real delivery counts are uneven across these four, drop the weakest vertical. Better 3 chips with real numbers than 4 chips with one looking thin.

---

## Layout

Right column, top to bottom:

1. **3D model viewport** (~70% of right-column height, centered)
2. **Chip selector row** (4 chips, evenly spaced, ~10% height)
3. **Active vertical micro-label** (~5% height) — small caps, e.g., "K-12 SCHOOL · 22 DELIVERED"

The chips sit visually below the model, not floating on top. Active chip filled with accent orange, inactive chips outlined.

---

## Interaction model

**Default state:**
- Page loads on K-12
- Model auto-orbits slowly (≈0.3 rpm — barely perceptible, not a screensaver)
- K-12 chip active

**Chip click:**
- Old model fades out (200ms) → new model fades in (300ms) with scale 0.95 → 1.0
- Stats row under CTAs updates with vertical-specific numbers (count-up animation, 400ms)
- Active vertical micro-label updates
- Eyebrow, headline, subhead, CTAs unchanged

**Model hover:**
- Auto-orbit pauses
- Cursor becomes grab — drag to rotate manually
- 2 second idle → resume auto-orbit

**Building click (within the model):**
- Building highlights: subtle emissive glow + outline in accent orange
- Annotation tooltip appears anchored to the building with one detail line
  - K-12 example, classroom wing: "12 classrooms · NEP-aligned · 60-day fit-out"
  - K-12 example, assembly hall: "500-seat capacity · acoustic-treated"
- Click outside or on another building to dismiss/switch
- Two annotation points per model

**Mobile (<768px):**
- Chips become horizontal scroll
- Auto-orbit only — disable drag-rotate (too easy to misfire on touch)
- Tap building → annotation appears as bottom sheet
- 3D model area shrinks to ~50% of viewport height; chips and stats stack below

---

## Dynamic stats (replace static row)

Current static stats: 50+ / 100% / ₹200Cr+

Replace with three slots that update per chip. Use real numbers from your delivery records.

| Vertical | Slot 1 | Slot 2 | Slot 3 |
|---|---|---|---|
| K-12 | XX schools | 100% on-time | ₹XXCr |
| Early Ed | XX centres | 100% on-time | ₹XXCr |
| Higher Ed | XX campuses | 100% on-time | ₹XXCr |
| Healthcare | XX facilities | 100% on-time | ₹XXCr |

If a vertical's count is too low to credibly show, drop that chip entirely.

---

## 3D model spec — applies to all 4 models

- Stylized low-poly. Same blue/white/orange palette as current Hero-v1.
- One hero building + 2–3 supporting elements per model. No full landscapes.
- Same camera angle, same ground plane, same lighting across all 4 — so the chip swap reads as "same context, different vertical" not "different scenes."
- Soft single-source lighting. No baked shadows that change between models.
- 2 annotation anchor points per model (defined in Blender/Spline as named empties).
- Polycount per model: under 15k tris.
- Format: GLB. Compress textures (KTX2 if possible).

---

## Build stack

- React Three Fiber + Drei
- Models built in Blender or Spline → exported as GLB
- Single `<Canvas>` shared across all models — swap models via component state, do not unmount/remount canvas
- `<Suspense>` boundary with low-detail wireframe placeholder during model swap
- Framer Motion for chip transitions and stat counters
- R3F's `useFrame` for orbit
- No GSAP needed — keep dependency footprint small
- Lazy-load non-default models. Preload K-12 immediately; preload others on chip hover.

---

## Performance budget

- First paint with K-12 model: under 1.2s on 4G
- Chip swap perceived: under 500ms
- Lighthouse Performance: 90+

---

## Execution order — do not skip

1. **Wireframe.** Sketch right-column layout: model viewport + chip row + micro-label + annotation tooltip position. Show me.

2. **Model spec sheet.** For each of the 4 verticals, list:
   - Hero building (name + brief shape description)
   - 2–3 supporting elements
   - 2 annotation points + the one-line detail per annotation
   - Real stat numbers (3 slots)
   Show me before modeling.

3. **Wait for approval on 1 and 2.**

4. **Build K-12 first as the default.** Get canvas, slow orbit, hover-pause, drag-rotate, click-to-annotate working with the K-12 model only.

5. **Add chip selector + Higher Ed model.** Verify the swap fade + scale + stat count-up animation.

6. **Build remaining 2 models** with the same camera, ground plane, lighting.

7. **Wire dynamic stats** to chip state.

8. **Performance pass.** Lazy-load, compress textures, test throttled 4G, run Lighthouse.

9. **Mobile pass.** Verify horizontal chip scroll, no drag-rotate, bottom-sheet annotation.

---

## Success test

A CTO from a K-12 group lands on the page, sees their vertical's chip already active, sees a recognizable school building (not abstract blocks), clicks the classroom wing, reads "12 classrooms · 60-day fit-out", and clicks "Book a 45-min assessment" — all without scrolling.

A CFO from a hospital group lands on the same page, clicks "Healthcare", sees a hospital with OPD wing in under half a second, sees the stats update to healthcare-specific numbers, and converts the same way.

If either of those flows takes more than 3 clicks or feels janky, it has failed.
