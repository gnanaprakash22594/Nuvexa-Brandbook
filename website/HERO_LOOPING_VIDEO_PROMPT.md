# HERO — Looping Video Treatment (Antigravity / Gemini 3.1 Pro)

The current hero loops through AI-generated campus stills (aerial view, basketball court with green wireframe overlay, computing lab). It reads as a jumpy slideshow with three problems:

1. **Legibility broken** — headline text and stats are sitting on busy photo backgrounds with no scrim. "CAMPUS TRANSFORMATION PARTNER" eyebrow disappears, "₹85Cr" stat overlaps with car bonnets.
2. **Tonal inconsistency** — aerial drone shot → AR wireframe overlay → generic stock-feel computer lab. Different scales, lightings, palettes. No through-line.
3. **AI uncanny** — typical stock-AI artifacts (warped signage, off proportions). Doesn't feel premium.

Below are TWO versions. Pick one. Don't try to merge them — they're different bets.

---

# VERSION A — Single Cinematic Shot Loop (RECOMMENDED for premium positioning)

**The bet:** one beautifully rendered campus, one slow continuous camera move, 6-second seamless loop. Apple product hero energy. Less is more.

## What to build

A single 6-second looping MP4/WebM showing ONE campus from a single continuous camera path. No cuts, no scene changes, no overlays. The camera does one of these moves:

- Slow drone push-in from high orbit → settling at human eye-level near the main entrance
- Slow lateral truck across the campus facade, revealing depth
- Slow vertical reveal: ground level → tilt up to show full building height

Loop seamlessly using a forward-then-reverse trick OR a path that ends framing identical to the start.

## Visual direction

- **Style:** stylized 3D render, NOT photoreal. Think Pixar architectural visualization — clean, slightly desaturated, brand-aligned.
- **Palette:** Nuvexa navy + warm white + accent orange highlights only. No green grass that fights the brand. Use muted sage or warm earth tones for landscaping.
- **Time of day:** golden hour. Long warm shadows. One consistent light source.
- **Camera:** very slow movement (feels meditative, not energetic). 6-second loop = ~10° of orbit max.
- **Detail level:** mid-detail. Visible windows, doors, signage reading "NUVEXA" subtly on building, students/cars as silhouettes only — no faces, no AI weirdness.

## Technical spec

- Resolution: 1920x1080 source, served as 1280x720 (good enough for hero, half the bandwidth)
- Format: WebM (VP9) primary + MP4 (H.264) fallback
- Duration: 6 seconds, seamless loop
- File size target: under 1.5MB combined
- Compression: handbrake CRF 28 for MP4, libvpx-vp9 -crf 33 for WebM
- Poster image: first frame as WebP at ~80KB

## Hero layout fixes (independent of video)

- **Add a left-to-right gradient scrim** over the video: rgba(8, 20, 45, 0.85) at left edge → rgba(8, 20, 45, 0) at 50% width. This locks left-column text legibility regardless of video content.
- **Stats row gets its own dark pill background** — semi-transparent navy with rounded corners, padding 16px 24px, so "22 schools / 100% on-time / ₹85Cr" stays readable.
- **Eyebrow "CAMPUS TRANSFORMATION PARTNER"** — increase font weight to 600, increase letter-spacing to 0.2em, color to accent orange #E96B2A. Legible against any background.

## Asset generation route

If generating with AI video tools (Sora, Runway, Kling):

> "Cinematic 6-second looping shot, slow drone push-in toward an Indian educational campus at golden hour. Modern architecture: 3-storey academic blocks in warm beige and navy accents, large windows reflecting orange sunset light, palm trees and clean landscaping, paved walkways, no people visible. Stylized architectural visualization, not photorealistic. Soft warm lighting, long shadows, gentle haze. Camera moves slowly and smoothly. Aspect 16:9. End frame should match start frame for seamless loop. Color palette: navy blue #08142D, warm white #F5EFE6, accent orange #E96B2A. No text, no signage, no UI overlays."

If commissioning a 3D artist: brief them with the same description + reference frames.

## Build steps

1. Generate / commission the video. Show me 3 options before committing.
2. Implement the gradient scrim + stats pill + eyebrow fixes in `Hero.tsx`.
3. Wrap the `<video>` in a `<picture>`-style fallback: WebM source first, MP4 fallback, poster image attribute.
4. Lazy-load the video — show poster image first, swap to video on `onLoadedData`. Use `preload="metadata"` only.
5. Mobile: serve a lower-res variant (640x360, ~400KB) via media queries on the source elements.
6. Verify Lighthouse Performance stays 90+ on production build.

---

# VERSION B — Multi-Vertical Story Loop (RECOMMENDED for breadth signaling)

**The bet:** 12-second loop that shows 4 institution types (K-12 → Higher Ed → Healthcare → Corporate) with proper crossfades and locked text overlays. Demonstrates breadth in one element.

## What to build

A 12-second seamless loop with 4 segments, 3 seconds each. Each segment shows one institution type in a stylized 3D shot. Crossfades between segments (1 second each). Final segment fades back to the first for seamless loop.

## Segment spec

| # | Vertical | Shot | Duration |
|---|---|---|---|
| 1 | K-12 School | Slow push toward a school facade with playground in foreground | 3s |
| 2 | Higher Ed | Slow lateral across a university quadrangle with library tower | 3s |
| 3 | Healthcare | Slow tilt up a hospital block with OPD wing visible | 3s |
| 4 | Corporate | Slow orbit around a corporate office with breakout pavilion | 3s |

Each segment uses the SAME camera language (slow movement, golden hour, same palette, same render style) so the cuts feel like chapters, not scene jumps.

## Visual direction

Same as Version A — stylized 3D render, navy + warm white + accent orange palette, golden hour, no people with faces.

KEY: the 4 segments must look like they belong to the same world. Same ground material, same sky tone, same lighting setup. Only the building changes.

## Vertical labels

Bottom-left of the video, small accent-orange label that fades in/out per segment:

- "K-12 SCHOOLS · 22 DELIVERED"
- "HIGHER ED · 8 CAMPUSES"
- "HEALTHCARE · 6 FACILITIES"
- "CORPORATE · 4 CAMPUSES"

Replace numbers with your real delivery counts. If a vertical's count is too thin, drop that segment and run 9 seconds with 3 segments instead.

## Technical spec

- Resolution: 1920x1080 source, served at 1280x720
- Format: WebM (VP9) + MP4 (H.264) fallback
- Duration: 12 seconds, seamless loop
- File size target: under 2.5MB combined
- Crossfade between segments: 1 second
- Poster image: first frame of segment 1

## Hero layout fixes

Same as Version A — gradient scrim, stats pill, eyebrow weight/color fix.

ADDITIONAL: vertical labels on the video need their own treatment — small accent-orange chip at bottom-left, 12px font, monospace or small-caps, fade in 200ms after segment starts, fade out 200ms before segment ends.

## Asset generation route

Generate 4 separate clips (3 seconds each) with consistent prompting, then stitch in a video editor with crossfades. Sample prompt for segment 1:

> "3-second cinematic shot, slow push toward an Indian K-12 school building at golden hour. Warm beige walls, navy blue accents, large windows, playground in foreground with subtle play equipment, palm trees. Stylized architectural visualization, not photorealistic. Soft warm lighting, long shadows. Camera moves smoothly toward the building. Aspect 16:9. Color palette: navy blue #08142D, warm white #F5EFE6, accent orange #E96B2A. No people with visible faces, no signage text."

Same prompt template for each vertical, swap the building type and contextual elements.

## Build steps

1. Generate / commission 4 clips. Verify they share the same world (sky, ground, lighting).
2. Stitch into one 12-second loop with crossfades. Export as WebM + MP4.
3. Implement the gradient scrim + stats pill + eyebrow fixes.
4. Add the vertical label component — fades in/out tied to video `currentTime` ranges (3s/6s/9s/12s).
5. Lazy-load video, mobile lower-res variant, Lighthouse 90+.

---

## Decision frame

**Pick Version A if:** you want premium minimalism, your buyer is design-conscious, you'd rather show ONE thing brilliantly than four things adequately. Lower production cost, easier to nail.

**Pick Version B if:** you want to signal breadth across verticals upfront, your buyer self-segments by institution type, you can produce 4 consistent clips. Higher production cost, more brand surface area.

For Nuvexa specifically: Version A unless you have real numbers across all 4 verticals AND the budget to render 4 clips that look like they belong to one world. If consistency slips, Version B reads worse than Version A — better to do less, well.

---

## STOP CONDITIONS

- If the generated video has visible AI artifacts (warped signage, weird people, melting geometry) — regenerate. Do not ship.
- If the loop is not seamless (visible jump at the loop point) — fix or re-render. Do not ship.
- If text legibility fails the squint test (squint at the screen, can you still read the headline?) — strengthen the gradient scrim before shipping.

Hard limit: 2 generation rounds. If after 2 rounds the asset isn't right, the AI generation route isn't going to work — switch to commissioning a 3D artist or use a high-quality stock architectural render.
