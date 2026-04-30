# Nuvexa Walkthrough Hero — Correction Prompt (v2 → v3)

> Paste this into Antigravity / Claude Code pointed at the existing `/hero-v2` build. This is a surgical fix pass, NOT a rewrite. Keep the file structure, camera rig, scroll wiring, and scene anchor positions. Replace scene *contents* and lighting.

---

## What's broken (from visual review of the live build)

1. **Scale is miniature.** The Scene 1 staircase, columns, and archway read as a tabletop prop. A campus must feel architectural — the viewer should feel small.
2. **Scene 1 columns are wrong.** Built as thin flat panels with vertical gold stripes. Reads like glass shower doors, not stone/concrete colonnades. Build them as solid 3D columns.
3. **Scene 1 HTML overlay collides with 3D.** H1 "Your campus. Built once. Built right." lands on top of the staircase. Pull the 3D composition right, pin HTML to left 42% with a cream-to-transparent gradient mask under it so text is always legible.
4. **Scene 2 is empty.** Black navy void. The discovery corridor never rendered. This is causing the "50% abstract" feeling.
5. **Scene 3 service blocks are cropped.** Left and right labels are half off-screen. Either pull the camera back or move the blocks inward.
6. **Scene 3 back-wall doorway is flat.** Just a yellow rectangle. Needs depth and a visible transition to Scene 4.
7. **Scene 4 "classroom blocks" are flat slabs.** No windows, no depth, no building language.
8. **Scene 4 has a misplaced white block** (a broken window-emissive) floating on the left at the wrong Y position. Delete or fix.
9. **Scene 5 "archway" is actually a trapezoid/pyramid.** Build it as a proper rectangular gate with two columns + a lintel, not a wedge.
10. **Scene 5 missing the far-distance campus silhouette.**
11. **Meta caption "You just walked through a campus — built from primitives, driven by scroll."** — DELETE. This is dev commentary. It cannot exist on a sales page.
12. **No institutional context anywhere.** Nothing reads as "campus." No signage, no facades with windows, no trees, no benches, no gate, no students, no blackboards. Right now it looks like a generic museum. Needs specific campus-world props in every scene.
13. **Connective architecture is missing between scenes.** Along the camera path, the space between anchor positions is empty navy. The architecture must be *continuous* so the camera never flies through a void.
14. **Lighting is blown out.** Every frame has an overexposed hotspot at the bottom-center. Tone-map clamp is missing. Bloom threshold too low.

---

## Fix instructions (surgical — edit, don't rewrite)

### A. Global lighting & tone mapping

In the `<Canvas>` config:
```jsx
<Canvas
  gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
  dpr={[1, 1.5]}
  shadows
>
```
In `Postprocess.tsx`:
- Bloom: `intensity={0.18}`, `luminanceThreshold={0.95}`, `luminanceSmoothing={0.2}` (currently blowing out the floor — lower threshold is the issue)
- Add `Vignette` with `offset={0.3}` `darkness={0.55}` to pull eyes to center
- Add `SSAO` on desktop only, `intensity={0.6}`, `radius={0.1}` — this is the single biggest missing thing; it gives corners/edges weight

Add scene-scoped `<fog attach="fog" args={['#0D2B4E', 35, 110]} />` inside each scene group with the scene's own atmosphere color (navy for scenes 1–2, teal-mixed for 3, cream for 4–5). Fog must match the scene's dominant background color.

Shadow config on the key directional light: `shadow-mapSize={[2048, 2048]}`, `shadow-camera-far={80}`, `shadow-bias={-0.0005}`.

### B. Scene 1 — APPROACH: make it feel architectural

**Scale up 2.0×** all geometry: plinth 50×50 (was 30×30), building wall 40×18 (was 20×10), columns 2.2×9×2.2 (was 1.2×6×1.2), 6 columns per side (was 5), stairs 14 steps of `BoxGeometry(12, 0.45, 1.4)`.

**Rebuild columns as solid 3D with detail**, not flat panels:
- Base `BoxGeometry(2.8, 0.4, 2.8)`, cream
- Shaft `BoxGeometry(2.2, 8, 2.2)`, navy-soft
- Capital `BoxGeometry(2.8, 0.6, 2.8)`, cream
- Group and instance 6 times per side. Add `<Edges threshold={15} color="#B8933A" />` only on the shaft.

**Make the archway a real portal, not a cutout.** Build it as:
- Two doorway columns `BoxGeometry(1.5, 9, 1.5)` navy
- Lintel `BoxGeometry(7, 1.2, 1.5)` navy with gold edges
- Behind the portal, place a `PlaneGeometry(6, 8)` with emissive cream material at low intensity — soft light spilling out of the building

**Add institutional signals:**
- Above the archway lintel, a `BoxGeometry(7, 1.2, 0.3)` signage plate in navy with gold `<Text>` reading "NUVEXA · CAMPUS DELIVERY"
- Two flagpoles flanking the stairs at the base — thin `CylinderGeometry(0.06, 0.06, 8)` with small cream `PlaneGeometry(1.2, 0.8)` flag
- Two cream planters at the base of the stairs (`BoxGeometry(2, 0.8, 2)` cream) with a stylized low-poly tree on each (`ConeGeometry(1, 3, 6)` green-dark #2d4a3e for foliage + small brown cylinder trunk)
- On the plinth surface near the front, two small signboards (`BoxGeometry(1.6, 1, 0.15)` cream) angled toward the camera, with gold `<Text>` reading "50+ CAMPUSES" / "100% ON TIME"

**Fix HTML overlay collision:**
- Wrap the HTML overlay in a container fixed to the left 42% of the viewport
- Apply `background: linear-gradient(to right, rgba(244,244,240,0.92) 0%, rgba(244,244,240,0.7) 50%, transparent 100%)`
- Shift the 3D composition camera + target to `[3, 5, 22]` looking at `[3, 3, 0]` so the scene sits in the right 55% of the frame

### C. Scene 2 — DISCOVERY: rebuild from scratch (it's not rendering)

This is the biggest gap. Likely the group is positioned incorrectly on Z, or its members are transparent. Rebuild.

**Geometry:**
- Floor: `PlaneGeometry(10, 45)` cream, positioned at y=0, z=-40 (centered around the scene anchor z=-25)
- Left wall: `BoxGeometry(0.5, 10, 45)` navy, positioned at x=-5
- Right wall: `BoxGeometry(0.5, 10, 45)` navy, positioned at x=5
- Ceiling: `BoxGeometry(10, 0.4, 45)` navy-deep, positioned at y=10 — with 5 recessed cream emissive strip lights running along z (cream `BoxGeometry(0.4, 0.1, 8)` at y=9.8, spaced every 8 units)
- Far-end doorway frame: at z=-48, build a doorway as described in Scene 1's portal but simpler — two columns + lintel, with a teal emissive `PlaneGeometry(4, 7)` visible behind it (preview of Scene 3's color bleed-through)

**The gold path lights (32 dots, not 24):**
Placed in TWO rows, offset from center by ±1.2 on X, not a single center line. More architectural, less kitschy. Each: `SphereGeometry(0.12)` with `meshStandardMaterial` emissive gold intensity 2, plus a tiny `pointLight` at the same position (intensity 0.3, distance 3) to cast real light.

**Blueprint engravings on walls (THIS is the campus signal):**
- On each side wall, mount 4 `PlaneGeometry(4, 3)` panels standing off the wall by 0.1 — these are framed blueprints. Use `meshStandardMaterial` with an emissive cream glow at 0.15 intensity.
- On each panel, draw a stylized elevation drawing using `<Line>` (drei) with gold color — simple rectangles with windows, a plan view, an axonometric. Even if hand-coded as line coordinates, this reads as architectural drawings.
- Label each panel with tiny `<Text>` at the bottom: "LIBRARY WING · EL-03" / "CLASSROOM BLOCK · EL-01" / "LAB WING · EL-07" / "COURTYARD PLAN"
- On the side walls between the drawings, `<Text>` at 25% opacity, navy, size 1.8, letter-spacing wide: "DISCOVER · MEASURE · SPECIFY"

**Architect's drafting table prop** at z=-20, x=0:
- `BoxGeometry(3, 1.5, 2)` navy-soft top on 4 thin legs
- A tilted `PlaneGeometry(2.5, 1.8)` cream on top at 15° with fine gold grid lines (`GridHelper` swapped for cream/gold, or a shader)
- One small `<Text>` reading "GAP ANALYSIS · 147 ITEMS"

**Camera anchor stays at `[0, 1.6, -25]` looking at `[0, 1.6, -45]`.**

**HTML caption unchanged** (Eyebrow "01 · DISCOVERY" etc.)

### D. Scene 3 — BUILD: fix the service block placement

**Move the 4 service blocks INWARD.** Currently cropped at edges because they were placed too wide. New X positions:
- Left-front at `[-5.5, 2.5, -52]` (was -8)
- Left-back at `[-5.5, 2.5, -62]`
- Right-front at `[5.5, 2.5, -52]` (was 8)
- Right-back at `[5.5, 2.5, -62]`
- Each block face should rotate to face the camera path (Y rotation 90° for left blocks, -90° for right)

**Make each service block a proper backlit signage plate,** not just a box:
- Base `BoxGeometry(4, 2, 0.3)` teal
- Front face `PlaneGeometry(3.8, 1.8)` in navy with emissive intensity 0.08 (makes the text pop)
- `<Text>` on top in cream, Manrope SemiBold, size 0.28, max width 3.4 — so it wraps properly on 2 lines
- Gold edges on the base only
- Small gold tick marks `<Text>` "01" / "02" / "03" / "04" in the top-left corner of each plate

**Back-wall doorway fix:** currently reads as flat. Build it as Scene 1's portal (two columns + lintel + recessed emissive) with the NEXT scene's color (cream) bleeding through — this telegraphs forward motion.

**Coffer ceiling fix:** The 4×4 gold grid should actually render as recessed coffers. Build each as `BoxGeometry(1.8, 0.15, 1.8)` recessed 0.15 into the ceiling, with `<Edges color="#B8933A" />` on each. Subtle `pointLight` in every other coffer (8 lights total, intensity 0.12, distance 4).

**Add construction props at floor level** — this is where "BUILD" needs to read:
- 2 stacks of building materials at the corners: each `BoxGeometry(1.5, 0.8, 1)` cream with gold edges, stacked 3 high (simple pallet visual)
- 1 horizontal I-beam (`BoxGeometry(6, 0.3, 0.3)` steel gray `#84929F`) placed along the floor at the back right
- 1 safety helmet proxy (low-poly from a `SphereGeometry(0.4)` top + `CylinderGeometry(0.5, 0.5, 0.2)` brim, in terracotta) on one of the material stacks — small visual nod to "builder"

**Camera anchor:** pull back to `[0, 3.2, -50]` looking at `[0, 2.8, -75]` so all 4 blocks fit in frame.

### E. Scene 4 — HANDOVER: rebuild the classroom blocks as real buildings

**The classroom blocks must read as academic buildings**, not slabs:
- Base structure `BoxGeometry(5, 7, 8)` navy-soft, with gold edges
- **Window grid:** 4×3 grid of windows on the facing wall. Each window: `PlaneGeometry(0.7, 1.1)` cream emissive intensity 1.2, inset 0.05 into the wall. Window frames: `BoxGeometry(0.8, 1.2, 0.1)` gold-edged navy-deep frame around each. This is the single biggest fix — rooms with lights = campus.
- Roof detail: a slight overhang `BoxGeometry(5.5, 0.3, 8.5)` cream on top
- Entrance at base: small doorway `BoxGeometry(1.2, 2.2, 0.2)` navy-deep recessed
- Small sign above each building entrance `<Text>` reading "WING A · 12 CLASSROOMS" and "WING B · LABS + LIBRARY"

**Courtyard details (the white block floating on the left was a broken emissive — delete, then add):**
- 4 stone benches in the courtyard: each `BoxGeometry(2.5, 0.4, 0.6)` cream, raised on two small supports
- A central flagpole: `CylinderGeometry(0.08, 0.08, 10)` navy with a cream flag
- 2 low-poly trees in the corners (same tree geometry as Scene 1)
- Stylized paving: swap the flat cream floor for a 6×6 grid of tile planes with thin 0.02 teal joints between

**The suspended text panel:** currently the title line "DELIVERED." is cropped out of frame above. Lower the panel's Y position from current to y=6 (not 8), and add a second row of smaller gold text underneath the two main lines: "50+ CAMPUSES · VERIFIED BY HANDOVER CERTIFICATES"

**Camera anchor:** `[0, 1.2, -85]` looking at `[0, 5.5, -95]` — still low, still dramatic, but pulled back slightly so the full panel fits.

### F. Scene 5 — OPERATING: fix the archway and add distance

**The "archway" is currently a trapezoid. Rebuild as a proper gate:**
- Left column `BoxGeometry(0.8, 7, 1.2)` navy-soft
- Right column `BoxGeometry(0.8, 7, 1.2)` navy-soft
- Lintel `BoxGeometry(7.5, 1.1, 1.2)` navy-soft
- Gold edges on all three
- A signage plate on the lintel `<Text>` in gold: "NUVEXA · DELIVERED · 2025"
- Remove the pyramid/trapezoid geometry entirely

**Add the missing distant campus:**
- At z=-155 to z=-170, place 6 low-poly buildings as silhouettes: varying `BoxGeometry` sizes 3–6 units wide, 4–10 tall, in navy-deep. No detail — just silhouettes.
- Behind them, a gradient `PlaneGeometry(80, 40)` at z=-175 running from cream at top to pale gold at horizon — this is the "sunrise over the finished campus" read.
- 2 of the distant buildings have a tiny cream emissive window grid so the campus "looks occupied"
- A faint dirt/grass ground plane extending from the archway to the distant buildings — `PlaneGeometry(40, 80)` cream-warm with a subtle teal strip down the center (the walkway continuing to the campus)

**Delete the meta caption** "↑ You just walked through a campus — built from primitives, driven by scroll." This is dev commentary and must not exist on the page. Permanently remove.

**HTML overlay at scene 5:**
- Eyebrow gold "04 · OPERATING"
- H2 in navy: "Your campus. Built. Operating. Yours."
- Sub slate: "The campus you toured in 3D is the campus you walk on day one."
- CTA terracotta: "Book a 45-minute walkthrough →"
- Secondary link slate underline: "Or read the contract clause that guarantees your handover date →"

### G. Connective architecture (closes the black-void gaps)

The biggest cause of "50% abstract and empty" is that between scene anchor positions, the camera flies through empty navy space.

**Fix:** The camera path crosses through Z = 0, -30, -60, -90, -120 with scenes centered on those Zs. But the space *between* (z = -15, -45, -75, -105) currently has nothing. Add:

- Between Scene 1 and Scene 2 (z = -10 to -20): extend Scene 1's colonnade walls to continue into the Scene 2 corridor entrance. The camera should feel like it's walking *through* the archway into the corridor — no cut, no black gap.
- Between Scene 2 and Scene 3 (z = -40 to -55): frame the exit doorway of the corridor as the entry doorway of the build room. Share the geometry. Wall continuity.
- Between Scene 3 and Scene 4 (z = -70 to -85): the ceiling opens up — build a gradual `BoxGeometry` ceiling that lowers from y=10 at z=-65 to y=0 (disappears) by z=-85. "Walking out of a building into the courtyard" read.
- Between Scene 4 and Scene 5 (z = -100 to -115): a gradual ground-level walkway of teal tiles continues from the courtyard stairs through to the final gate. No gap.

**Every scene must have `<fog>` with `near` and `far` values sized so the next scene is visible but atmospherically separated.** Navy fog in Scene 1–2, teal-tinted fog in 3, cream/warm fog in 4–5.

### H. Copy on the page — delete banned phrases

Remove from anywhere in the hero-v2 DOM:
- "built from primitives"
- "driven by scroll"
- "journey"
- "transformative"
- "immersive"

Replace any marketing prose with brand voice: specific numbers, short sentences, lead with accountability.

### I. Camera pacing tweak

Current path is showing lots of empty space at transitions because the easing is linear. Change the scroll-to-progress mapping to apply an **ease-in-out cubic curve** so the camera spends MORE time at scene anchors and LESS time flying between them. Use `gsap.parseEase('power2.inOut')(rawProgress)` before feeding into `path.getPointAt(t)`.

Also: reduce total path length from `400vh` pin to `500vh` pin — gives each scene ~100vh of scroll dwell, matching the new easing.

---

## Acceptance criteria for v3

1. No frame of the scroll sequence shows a black void or empty navy space. Every frame has visible architecture.
2. Every scene contains at least 3 campus-world details (signage, window grid, bench, tree, flagpole, blueprint drawing, construction prop, etc.). A buyer can identify "this is a school/university" from any still frame.
3. Scene 1 HTML H1 does not overlap 3D geometry at any viewport width ≥ 1280px.
4. Scene 2 renders completely (no black void).
5. Scene 3 all four service labels fully visible within the viewport at the anchor camera position.
6. Scene 4 classroom blocks have visible window grids. The floating broken white block is removed. The "DELIVERED." line of the suspended panel is fully visible at the anchor.
7. Scene 5 has a proper rectangular gate (two columns + lintel), a distant multi-building campus silhouette, and a sunrise-gradient sky.
8. The meta caption "You just walked through a campus…" is deleted.
9. Bloom is no longer blowing out the floor. Dark corners have SSAO. Image feels filmic, not gamey.
10. At every scroll position, the next scene is faintly visible through fog — never popping in.

---

## Deliverable

Apply fixes. Take new screenshots at each of the 5 anchor camera positions. Save to `/public/screenshots/walkthrough-v3-scene-{1..5}.jpg`. Commit: `fix(hero-v2): add architectural continuity, campus context, and fix scene 2 render`.

If any instruction conflicts with existing code structure, resolve it in favor of the instruction — this spec overrides prior decisions. Do not add new colors. Do not add 3D text beyond what's specified. Do not write marketing prose. Stay in the brand's voice.
