# Nuvexa — Cinematic Walkthrough Hero Prompt

> Build this as a **second**, side-by-side hero variant. Do **NOT** modify the existing rotating-block hero. Save the new component to `components/hero/HeroWalkthrough.tsx` and create a route at `/hero-v2` that renders only this hero so we can A/B compare against `/`.

---

## Reference & intent

We're translating a Spline "Architecture Walkthrough" scene into a custom React Three Fiber experience, recolored and rewritten for Nuvexa's brand and story. The Spline original is a 5-scene cinematic dolly through stylized architecture: wide approach with stairs → dark portal corridor → orange "services room" with text on walls → dramatic teal upward courtyard → cream doorway outro.

For Nuvexa, the camera walks a buyer through the literal value chain we sell:

```
Scene 1: APPROACH   (hero)         — wide shot of a campus entrance with stairs
Scene 2: DISCOVERY  (corridor)     — dark portal, gold dimension lines on the floor
Scene 3: BUILD      (services room) — 4 service labels on the walls
Scene 4: HANDOVER   (courtyard)    — dramatic upward view, navy text panel
Scene 5: OPERATING  (doorway)      — cream daylight, single archway, CTA
```

**Critical layout decision (do not change):**
- Scene 1 is the **hero** — fits in 100vh, scroll-coupled to a *short* dolly (10–15% camera path), then user keeps scrolling normally to reach the next section.
- Scenes 2–5 live in a **separate pinned section** below the hero (`<HeroWalkthroughExtended />`), 400vh of scroll = 100vh sticky canvas, each scene takes ~100vh of scroll.
- This keeps LCP fast, page rhythm normal, and avoids a 500vh hero that tanks engagement.

---

## Stack

- React Three Fiber (`@react-three/fiber`)
- `@react-three/drei` — `Text`, `Float`, `Environment`, `useScroll`, `Plane`, `RoundedBox`, `Edges`, `MeshTransmissionMaterial`
- `@react-three/postprocessing` — Bloom, Vignette (desktop only, motion enabled)
- `gsap` + `ScrollTrigger` for the pinned extended section
- `lenis` already in the layout
- `three` (geometry primitives + CatmullRomCurve3 for camera path)

No external `.glb` needed for v1 — build everything from primitives. Designed to be replaced by a Blender export later if we want.

---

## Brand (locked)

```
Navy       #0D2B4E
Navy soft  #143560
Cream      #F4F4F0
Gold       #B8933A
Teal       #0A4A42
Teal soft  #0D6B5E
Terracotta #C1440E
Slate      #334155
Steel      #84929F
```

Color rules in 3D:
- Surfaces: Navy, Navy-soft, Cream, Teal — these are the *room colors*
- Edges (line segments via `<Edges>`): Gold only — represents the blueprint motif
- Emissive: Cream (window light), Gold (path light), warm 4500K
- Terracotta lives in HTML overlays only (CTAs, the final scene's CTA chip). Never in 3D materials.

Voice rules: short, specific, no buzzwords. Banned: passionate, holistic, ecosystem, synergy, visionary, transformative, journey, unlock, leverage.

---

## SCENE BLUEPRINTS

Build each scene as a self-contained group component. Position them along a single Z-axis spine 30 units apart so the camera dolly is `position.z` interpolation.

### Scene 1 — APPROACH (hero, z = 0)

**Composition (low-poly stylized institutional gate):**
- A wide cream marble *plinth* (`PlaneGeometry` 30×30, MeshStandardMaterial cream, slight roughness 0.6)
- A central *staircase* climbing toward camera-back: 8 steps, each `BoxGeometry(8, 0.4, 1.2)`, stacked, cream material
- Two *colonnades* flanking the stairs: each side has 5 navy-soft rectangular columns (`BoxGeometry(1.2, 6, 1.2)`), spaced 2 units apart
- Behind the colonnades, a *building wall* rising up: `BoxGeometry(20, 10, 0.5)` in navy
- In the wall, a tall *portal archway*: cut-out illusion = a darker navy.deep `BoxGeometry(4, 7, 0.3)` recessed slightly
- Above the building, a soft *gradient sky*: not a skybox — a large `PlaneGeometry` behind everything with a vertical gradient shader (cream at top → navy at horizon)
- Ground extends forward toward camera with subtle teal reflection (low-opacity teal plane underneath the cream plinth)

**Edges:** Gold `<Edges threshold={15} color="#B8933A" />` on the columns and the archway only — not on the steps or ground. Keeps it surgical.

**Lighting:**
- 1 `<directionalLight>` from upper-left (position [10, 12, 5], intensity 1.2, warm 4500K, casts soft shadows)
- 1 `<ambientLight intensity={0.35} />`
- 1 `<spotLight>` aimed at the archway from above — emissive cream, intensity 1, penumbra 0.5 (this draws the eye to the entrance)

**Camera (hero state, scrolly = 0):**
- Position `[0, 5, 22]` looking at `[0, 3, 0]` — wide, slightly elevated, symmetrical
- FOV 35 (cinematic, not GoPro)

**Camera (hero state, scrolly = 0.15):**
- Position `[0, 4, 16]` looking at `[0, 3.5, 0]` — slow forward push toward the archway
- This is the only camera move during hero scroll. After 15% scroll past hero, the next page section takes over.

**3D text (drei `<Text>`):**
- Floor inscription on the cream plinth, in front of the stairs:
  - "CAMPUS TRANSFORMATION PARTNER" — Manrope ExtraBold, color gold, size 0.4, anchorX center, anchorY middle, rotation [-π/2, 0, 0], position [0, 0.05, 8]
- That's it inside the 3D for scene 1. The H1, sub, CTAs, and stat strip live as **HTML overlay** on top of the canvas (left-aligned column over the left third of the screen, navy text on cream gradient — same copy as current hero).

### Scene 2 — DISCOVERY (z = -30)

The Spline's "dark corridor" moment. For Nuvexa: the discovery phase, where blueprints get drawn before anything is built.

**Composition:**
- A long *corridor*: floor (cream `PlaneGeometry` 8×40), ceiling (navy plane 8×40 above), two side walls (navy `PlaneGeometry` 40×8) closing it in
- On the floor: a vertical line of 24 small *gold dots* spaced 1.5 units apart down the center, each `<mesh>` with `SphereGeometry(0.08)` + emissive gold material, intensity 1.2 — these are the "path lights" / dimension marks
- On both side walls: subtle *engraved text* (drei `<Text>`) at low opacity 0.25, navy color, large size 1.2 — left wall reads "DISCOVER · MEASURE · SPECIFY", right wall reads "EVERY GAP. EVERY CONSTRAINT. EVERY DEADLINE."
- Far end of the corridor: a navy.deep wall with a thin gold *frame outline* of a doorway — beyond which Scene 3 will be visible

**Lighting:**
- Very dim. Only the gold path dots emit light.
- 1 `<ambientLight intensity={0.08} />`
- 1 weak `<spotLight>` from above the far doorway, pointed forward, cream tint

**Camera at this scene anchor:**
- Position `[0, 1.6, -25]` (on the floor, eye level, deep into corridor)
- Looking at `[0, 1.6, -45]` (toward the far doorway)

**HTML overlay caption (cross-fades in via Framer Motion):**
- Eyebrow gold "01 · DISCOVERY"
- H3 cream "We map every constraint before we draw a line."
- Body cream/85 "147 compliance items. 1 site survey. 1 timeline locked."

### Scene 3 — BUILD (z = -60)

The Spline's "orange services room" — recolored to **teal** for Nuvexa rhythm, with our 4 build pillars on the walls instead of generic services.

**Composition:**
- A wider room than the corridor: floor 16×16 cream, ceiling 16×16 navy with embedded gold *coffer pattern* (a 4×4 grid of recessed gold-lit squares — use 16 small `BoxGeometry(2, 0.2, 2)` planes with emissive gold edges)
- Side walls: tall `BoxGeometry(0.5, 10, 16)` in **teal soft** (#0D6B5E)
- Back wall: navy with a central darker doorway recess
- Inside the room, **4 service blocks** — two on each side, jutting from the walls like raised display shelves: each `BoxGeometry(3, 1.5, 0.8)` in teal, with gold edges, with a `<Text>` label on the front face
  - Left-front: "ARCHITECTURE & DESIGN"
  - Left-back:  "CONSTRUCTION"
  - Right-front: "FIT-OUT & INTERIORS"
  - Right-back: "COMPLIANCE & CERTIFICATION"
- Each label: Manrope SemiBold, cream, size 0.35

**Lighting:**
- Brighter than corridor — 1 directional from above, 1 ambient 0.3
- The coffer ceiling glows gold faintly (emissive)
- Spotlights pick out each of the 4 service blocks from above

**Camera at this scene anchor:**
- Position `[0, 2.5, -55]` — entered the room
- Looking at `[0, 2.5, -75]` — toward the back doorway

**HTML overlay:**
- Eyebrow gold "02 · BUILD"
- H3 cream "Four pillars. One contract. One PM."
- Body cream/85 "Architecture, construction, fit-out, compliance — all under one roof. Nothing outsourced."

### Scene 4 — HANDOVER (z = -90)

The Spline's dramatic upward courtyard. For Nuvexa: the moment of handover, where a buyer sees the finished campus they were promised.

**Composition:**
- A *sunken courtyard* — the camera enters at low POV looking up
- Central hero element: a tall *navy text panel* (`BoxGeometry(8, 5, 0.4)`) suspended in the upper portion of the frame, with gold edges, with `<Text>` reading:
  - Top line: "DELIVERED."
  - Bottom line: "ON THE DATE IN YOUR CONTRACT." (smaller, gold)
- Below the panel and rising up to it: a wide cream *staircase* (12 steps, `BoxGeometry(10, 0.5, 1.5)` stacked)
- Flanking the stairs: two **classroom blocks** — `BoxGeometry(4, 6, 6)` each, in navy.soft, with gold edges, with small emissive cream window cutouts (use 6 small cream-emissive `PlaneGeometry(0.8, 1.2)` per block, arranged in a 3×2 grid as fake windows, intensity 1.5)
- Floor: teal soft tile pattern
- Sky behind: cream gradient

**Lighting:**
- Dramatic: 1 directional from upper-back simulating late-afternoon sun (warm gold, intensity 1.4)
- Strong rim light on the suspended panel
- Window emissives glow

**Camera at this scene anchor:**
- Position `[0, 0.8, -82]` (low, looking up)
- Looking at `[0, 4.5, -98]` (up at the suspended panel)
- This is the *one* camera move with vertical drama. Make it count.

**HTML overlay:**
- Eyebrow gold "03 · HANDOVER"
- H3 cream "The campus you toured in 3D is the campus you walk on day one."
- Body cream/85 "100% on-time delivery across 50+ campuses. Verified."

### Scene 5 — OPERATING (z = -120)

The Spline's cream doorway outro. For Nuvexa: the campus is now operating, and the page transitions out of the 3D experience.

**Composition:**
- Empty cream space — `PlaneGeometry(40, 40)` floor in cream, no walls, no ceiling
- Single central *archway* — two navy.soft columns + a navy lintel, gold edges, framing the empty cream beyond
- Through the archway: a teal *floor-strip* extending forward into infinity (perspective vanishes)
- Subtle floor reflection of the arch
- Far in the distance, a tiny silhouette of a campus block in navy — implied future, not detailed

**Lighting:**
- Bright cream daylight from above
- 1 ambient 0.6, 1 directional from upper-front
- No emissives — this is the "after" scene

**Camera at this scene anchor:**
- Position `[0, 2, -110]` looking at `[0, 2, -135]` — straight through the archway

**HTML overlay:**
- Eyebrow gold "04 · OPERATING"
- H3 navy "Your campus. Built. Operating. Yours."
- Single CTA, terracotta filled: "Book a 45-minute walkthrough →"
- Below: small slate text "Or see how we structure the contract →"

---

## Camera path (the spine)

Use a `THREE.CatmullRomCurve3` through these 5 anchor points + a few in-between waypoints to keep the dolly smooth:

```js
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 5, 22),       // Scene 1 wide
  new THREE.Vector3(0, 4, 16),       // Scene 1 push (hero scroll end)
  new THREE.Vector3(0, 2.5, 0),      // entering scene 2 corridor
  new THREE.Vector3(0, 1.6, -25),    // Scene 2 deep in corridor
  new THREE.Vector3(0, 2.0, -45),    // exiting corridor through doorway
  new THREE.Vector3(0, 2.5, -55),    // Scene 3 entered room
  new THREE.Vector3(0, 2.5, -75),    // exiting room through back doorway
  new THREE.Vector3(0, 1.5, -82),    // descending into courtyard
  new THREE.Vector3(0, 0.8, -88),    // Scene 4 low POV
  new THREE.Vector3(0, 1.5, -100),   // climbing stairs
  new THREE.Vector3(0, 2.0, -110),   // approaching final arch
  new THREE.Vector3(0, 2.0, -120),   // Scene 5 through archway
], false, 'catmullrom', 0.5);
```

LookAt path = same idea, second curve, offset forward by ~15 units on each waypoint.

```js
const camera = useThree(s => s.camera);
const { scrollY } = useScroll(); // from Lenis or a custom store
useFrame(() => {
  const t = THREE.MathUtils.clamp(progress, 0, 1);
  const pos = path.getPointAt(t);
  const look = lookPath.getPointAt(t);
  camera.position.lerp(pos, 0.08);  // damping
  const target = new THREE.Vector3().lerpVectors(currentLook, look, 0.08);
  camera.lookAt(target);
});
```

---

## Scroll wiring

**Hero (Scene 1):**
- The hero canvas is fixed-position inside its 100vh wrapper
- Listen to window scrollY; map 0 → (window.innerHeight * 0.5) → progress 0 → 0.08 of the path
- After scrollY > 0.5 viewport, hero hands off to next section (the canvas can keep rendering scene 1 from the same camera position; the user just scrolls past)

**Extended walkthrough (Scenes 2–5):**
- Use GSAP ScrollTrigger to pin a `<section>` of height `400vh` for `100vh` of canvas
- Inside that pin, scroll progress 0–1 maps to path progress 0.08 → 1.0
- Each 25% scroll = one scene transition
- HTML caption overlays cross-fade based on scroll progress ranges:
  - 0.00–0.20 → caption 2 (Discovery)
  - 0.25–0.45 → caption 3 (Build)
  - 0.50–0.70 → caption 4 (Handover)
  - 0.75–1.00 → caption 5 (Operating + CTA)

Use Framer Motion `useTransform` from a `useMotionValue` driven by ScrollTrigger.

---

## Performance budget

- The whole walkthrough must add **< 250 KB gzipped JS** beyond the base bundle
- All geometry from primitives — no `.glb` for v1. Total triangle count target: < 30k
- One `<Canvas>` instance shared between hero (Scene 1) and extended (Scenes 2–5). Mount once, never unmount on scroll.
- Use `gl={{ antialias: true, powerPreference: 'high-performance' }}` and `dpr={[1, 1.5]}` (cap pixel ratio)
- `<Suspense>` fallback = the existing static hero PNG — that PNG is the LCP element, not the canvas
- `prefers-reduced-motion` → never mount canvas at all. Render a static hero illustration + a clean linear list of the 5 scene captions with small architectural icons. Equivalent narrative, zero motion.
- Mobile (< 768px): render only Scene 1 (hero), with no scroll dolly — static camera. The extended walkthrough is **replaced on mobile** with a simple vertical 4-card scroll (each card = one scene, with a small static 3D thumbnail). Don't ship the full 5-scene experience to mobile devices.
- Postprocessing (Bloom + Vignette) only on desktop with motion enabled
- Run `gltf-pipeline`-style optimizations on any future `.glb`

---

## File structure

```
components/hero/
  HeroWalkthrough.tsx            ← Scene 1 only, hero wrapper, HTML overlay
  HeroWalkthroughExtended.tsx    ← pinned 4-scene section
  scenes/
    SceneApproach.tsx
    SceneDiscovery.tsx
    SceneBuild.tsx
    SceneHandover.tsx
    SceneOperating.tsx
  rig/
    CameraRig.tsx                ← path + scroll-driven dolly
    Lights.tsx                   ← shared lighting setup if useful
    Postprocess.tsx              ← desktop-only effects
  HeroWalkthroughFallback.tsx    ← static reduced-motion version

app/(site)/hero-v2/
  page.tsx                       ← renders ONLY HeroWalkthrough + HeroWalkthroughExtended for A/B compare
```

Do NOT touch:
- `app/(site)/page.tsx` (current home with rotating block hero stays as-is)
- The current `Hero3D.tsx` / rotating-block component
- Any layout, nav, footer, brand tokens

---

## Acceptance criteria

1. `/` still renders the original rotating-block hero, untouched. Lighthouse score unchanged on `/`.
2. `/hero-v2` renders the new 5-scene walkthrough. Hero is 100vh, extended walkthrough is 400vh of pinned scroll.
3. Camera dolly is smooth (lerp damping, no jitter). Path is correct across all 5 anchors.
4. HTML captions cross-fade in sync with scroll progress.
5. Brand colors are the only colors used. Zero teal in CTAs. Zero terracotta in 3D materials. Zero non-brand colors anywhere.
6. `prefers-reduced-motion` shows the static fallback (no canvas mounted).
7. Mobile shows hero scene 1 static + a separate 4-card vertical replacement for the walkthrough.
8. Lighthouse Performance ≥ 90 mobile, ≥ 92 desktop on `/hero-v2`.
9. LCP element is the static hero PNG; canvas mounts after.
10. Bundle size of the walkthrough chunks combined: < 250 KB gzipped.

---

## What to do after building

1. Run `npm run build` and report bundle sizes per chunk.
2. Run Lighthouse on both `/` and `/hero-v2` headless. Report both.
3. Take a 4K screenshot of each scene at its anchor camera position. Save to `/public/screenshots/walkthrough-scene-1.jpg` … `walkthrough-scene-5.jpg`.
4. Commit with message: `feat(hero): add cinematic walkthrough variant at /hero-v2 for A/B`.

That's it. Build it. No deviation from the brand rules. No extra colors. No buzzwords in the captions. If something blocks you, return with a specific question — don't improvise on brand or copy.
