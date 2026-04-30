# HERO V1 UPGRADE — Replace block stack with interactive institution selector

I reviewed Hero-v1. The layout works — clean left column with eyebrow, "Your campus. Built once. Built right." headline, subhead, two CTAs, and stats row. Don't touch any of that. The problem is the right column: a slowly rotating stack of plain white-blue boxes with thin orange edges. It reads as a placeholder, not a product. No depth, no story, no reason to interact.

We have two ways forward. I'm recommending Option B because it does more work for the business — it self-segments visitors by vertical and demonstrates breadth in one component. Build Option B unless we explicitly choose A.

---

## Option A — Single detailed campus model (rejected unless specified)

One rich 3D campus on the right: full institutional grounds, multiple buildings, landscape, a few labeled callouts (admin block, classroom wing, sports complex, library). Slow ambient orbit. Hover-to-pause. Click a callout → tooltip with one stat.

**Why I'm not recommending this:**
- One mega-model = heavy, slow first paint
- Tells one story (campus = generic) instead of demonstrating range
- No self-segmentation signal — every visitor sees the same thing

---

## Option B — Institution Selector (RECOMMENDED — build this)

Right column shows a small detailed 3D model of one institution type at a time. Below or beside the model: a horizontal selector with 4–5 chips. Click a chip → model swaps to that institution type with a smooth dissolve, label updates, stats below the headline update to that vertical's numbers.

**Institution types (chips):**

1. **K-12 School** — Multi-storey block + playground + assembly hall
2. **Early Ed** — Single-storey, softer geometry, courtyard, low fence
3. **Higher Ed** — University campus: lecture block + library tower + quadrangle
4. **Healthcare Campus** — Hospital block + OPD wing + ambulance bay
5. **Corporate Campus** — Office tower + breakout pavilion + parking structure

(Trim to 4 if 5 feels crowded. K-12, Early Ed, Higher Ed, Healthcare is a strong default set.)

**Why this works for the business:**
- Demonstrates 4–5 verticals of expertise in one component without needing 5 case study pages
- Visitor self-identifies by clicking — that's a behavioral signal worth capturing
- Each model can be small (one detailed building per vertical) — fast load, no mega-scene
- Stats can dynamically update per vertical — "K-12: 22 schools delivered" / "Higher Ed: 8 campuses" — proves depth, not just breadth
- The chip click becomes a conversion micro-event you can track

---

## Interaction model

**Default state:**
- Page loads on K-12 (most common visitor vertical for Nuvexa)
- Model auto-orbits slowly (0.3 rpm, very subtle)
- Active chip highlighted in accent orange

**On chip click:**
- Old model fades out (200ms) → new model fades in (300ms) with a soft scale-up from 0.95 → 1.0
- Stats row under CTAs updates with vertical-specific numbers (count up animation, 400ms)
- Eyebrow stays "CAMPUS TRANSFORMATION PARTNER" — does not change
- Headline + subhead + CTAs unchanged

**On model hover:**
- Auto-orbit pauses
- Cursor becomes grab — user can drag to rotate manually
- 2 second idle → resumes auto-orbit

**On model click (any building/wing within the model):**
- Building highlights (slight emissive glow + outline)
- Annotation tooltip appears with: building name + one detail line
  - Example for K-12: click classroom wing → "12 classrooms · NEP-aligned · 60-day fit-out"
- Click outside or on another building to dismiss/switch

**Mobile:**
- Selector chips become horizontal scroll
- 3D model gets fixed orbit (no drag — too easy to misfire on touch)
- Tap building → annotation appears as bottom sheet

---

## Visual + technical guardrails

**3D models:**
- Stylized low-poly with the same blue/white/orange palette already in Hero-v1
- Each model: one hero building + 2–3 supporting elements (no full landscapes)
- Same camera angle and ground plane across all 5 models so the swap feels consistent
- Soft single-source lighting, no shadows that change between models
- Total polycount per model: under 15k tris
- Use GLB format, lazy-load non-default models on chip hover (preload K-12 immediately)

**Build stack:**
- React Three Fiber + Drei (already common, easy to maintain solo)
- Models built in Blender or Spline, exported as GLB
- Suspense boundary with a low-detail wireframe placeholder during model swap
- Single shared canvas, models swapped via component state — do not unmount/remount canvas

**Animation:**
- Use Framer Motion for chip transitions and stat counters
- Use R3F's useFrame for orbit
- No GSAP needed for this — keep dependency footprint small

**Performance budget:**
- First paint with K-12 model: under 1.2s on 4G
- Chip swap: under 500ms perceived
- Single Lighthouse score target: 90+ Performance

---

## What to keep from Hero-v1 (DO NOT TOUCH)

- Eyebrow text and styling
- Headline: "Your campus. Built once. Built right."
- Subhead: "Design, build, fit-out, certify — under one contract, on a date you can sue us for."
- Both CTAs: "Book a 45-min assessment" + "See our 50+ handovers"
- Stats row layout (numbers will become dynamic per vertical)
- Top nav
- Overall left-column proportions and typography

---

## What to delete

- The current stacked-blocks 3D placeholder
- Any auto-rotation that feels mechanical or screensaver-like
- Don't add scroll-driven camera movement — this is a hero, not a scroll story (that's Hero-v2's job)

---

## Execution order

1. **Wireframe.** Sketch the new right-column layout: model area + chip selector + annotation tooltip position. Show me before building.
2. **Model spec.** List the 5 institution types with: hero building + 2–3 supporting elements + 2 annotation points each. Show me the spec before modeling.
3. **Wait for approval on 1 and 2.**
4. **Build K-12 first as the default.** Get the canvas, orbit, hover-pause, drag-rotate, click-to-annotate working with one model.
5. **Add chip selector + 1 more model (Higher Ed).** Verify the swap animation.
6. **Build remaining models in parallel.** Same camera angle, same ground plane, same lighting.
7. **Wire dynamic stats** to chip selection.
8. **Performance pass.** Lazy-load, compress textures, test on throttled 4G.

---

## Success test

- Hero looks identical to V1 on first paint (same simplicity)
- Right column shows a recognizable, detailed institution model — not abstract blocks
- Clicking a chip swaps the vertical in under half a second with a clean fade
- Clicking a building shows a one-line proof point
- Stats row reflects the chosen vertical
- Mobile works without breaking the layout

The bar: a CTO visiting from a K-12 group should click their vertical, see a recognizable building, click the classroom wing, read "12 classrooms · 60-day fit-out", and book the 45-min assessment without scrolling.
