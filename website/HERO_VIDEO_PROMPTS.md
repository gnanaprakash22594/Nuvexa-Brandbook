# PROMPT A — Single Cinematic Loop

Replace the current hero slideshow with a single 6-second seamless looping video. One stylized 3D render of a campus, slow drone push-in at golden hour, navy + warm white + accent orange palette, no people with faces, no AI artifacts, no scene cuts.

Generate or source the video as WebM (VP9) primary + MP4 (H.264) fallback, 1280x720, under 1.5MB combined, with a WebP poster image (~80KB).

Fix hero text legibility regardless of video:
- Add left-to-right gradient scrim: rgba(8, 20, 45, 0.85) at left edge fading to transparent at 50% width
- Wrap the stats row in a semi-transparent navy pill background, padding 16px 24px
- Bump eyebrow "CAMPUS TRANSFORMATION PARTNER" to font-weight 600, letter-spacing 0.2em, color #E96B2A

Implementation:
- Show poster image first, swap to video on onLoadedData
- preload="metadata" only, autoplay muted loop playsInline
- Mobile (<768px): serve a 640x360 ~400KB variant via media query on source elements
- Lazy-load behind IntersectionObserver
- Keep Lighthouse Performance 90+ on production build

Do NOT touch nav, headline, subhead, CTAs, or stats numbers. Only replace the video element and add the scrim/pill/eyebrow legibility fixes.

If the generated video has AI artifacts (warped signage, weird people, melting geometry) or the loop point is visible — regenerate. Hard limit: 2 generation rounds before switching to commissioned 3D render.

---

# PROMPT B — Multi-Vertical Story Loop

Replace the current hero slideshow with a 12-second seamless looping video showing 4 institution types in 3-second segments with 1-second crossfades: K-12 → Higher Ed → Healthcare → Corporate.

All 4 segments must share the same world: same sky, same ground material, same golden hour lighting, same camera language (slow movement, no cuts inside a segment), same stylized 3D render style. Navy + warm white + accent orange palette. No people with faces.

Generate 4 clips separately with consistent prompting, stitch with crossfades, export as WebM (VP9) primary + MP4 (H.264) fallback, 1280x720, under 2.5MB combined, with a WebP poster image.

Add a small accent-orange vertical label at bottom-left of the video that fades in/out per segment, tied to video currentTime:
- 0–3s: "K-12 SCHOOLS · 22 DELIVERED"
- 3–6s: "HIGHER ED · 8 CAMPUSES"
- 6–9s: "HEALTHCARE · 6 FACILITIES"
- 9–12s: "CORPORATE · 4 CAMPUSES"

Replace the numbers with the actual delivery counts I provide. If a vertical has thin numbers, drop that segment and run 9 seconds with 3 segments.

Fix hero text legibility:
- Add left-to-right gradient scrim: rgba(8, 20, 45, 0.85) at left edge fading to transparent at 50% width
- Wrap the stats row in a semi-transparent navy pill background, padding 16px 24px
- Bump eyebrow to font-weight 600, letter-spacing 0.2em, color #E96B2A

Implementation:
- Poster image first, swap to video on onLoadedData
- preload="metadata", autoplay muted loop playsInline
- Mobile (<768px): 640x360 lower-res variant via media query
- Lazy-load behind IntersectionObserver
- Lighthouse Performance 90+ on production build

Do NOT touch nav, headline, subhead, CTAs, or main stats numbers. Only replace the video element and add the scrim/pill/eyebrow/vertical-label fixes.

If the 4 clips don't visibly share the same world (sky/ground/lighting mismatch), regenerate or fall back to Prompt A. Hard limit: 2 generation rounds.
