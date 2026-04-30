# Nuvexa Website — Claude Code / Antigravity Build Prompt

> Paste the master prompt into Claude Code at the root of an empty folder. Then feed page prompts one at a time as you iterate.

---

## ⚙️ MASTER PROMPT (run first)

```
You are building the new Nuvexa website — a premium, story-driven, 3D-anchored marketing site for an Indian campus transformation firm.

## Brand (locked, do not deviate)

Name: Nuvexa
Positioning: Campus Transformation Partner. One contract, one PM, single-point accountability, contractually guaranteed timelines.
Personality: Creator-Hero. Competence HIGH, Sincerity & Sophistication MOD-HIGH, Excitement MODERATE.
Voice: Specific numbers over adjectives. Short sentences. Lead with accountability. Reference the guarantee often.
Banned words: passionate, holistic, ecosystem, synergy, visionary, transformative, world-class, cutting-edge, leverage, unlock, journey.

## Visual system (locked — 5-color discipline)

Colors:
  navy:       #0D2B4E (primary surface, headings)
  cream:      #F4F4F0 (canvas)
  gold:       #B8933A (premium accent — borders, eyebrows, hovers, badges; NEVER primary surface, NEVER a button background)
  teal:       #0A4A42 (secondary dark surface — the only allowed alternative to Navy for dark sections; used to add rhythm to long scrolls)
  terracotta: #C1440E (CTAs, the guarantee, urgency, structural commitments ONLY — never decorative)
  slate:      #334155 (body text on cream)
  steel:      #84929F (borders, meta, dividers)

Color rules (enforce strictly — 5 colors needs more discipline than 4):
- Navy + Cream is the primary surface pair. ~90% of the site lives here. Lead with it.
- Teal is the ONLY alternative dark surface to Navy. Use it to break monotony in long scrolls (e.g. Navy → Teal → Cream → Navy across sections). NEVER place Navy and Teal blocks adjacent on the same viewport — alternate, don't stack.
- Gold is for premium signals only — eyebrows, borders, hover states, stat dividers, accents. NEVER a fill exceeding ~5% of any viewport. NEVER a button background. Cap minimum size at 13px (Gold often fails AA at small sizes).
- Terracotta is action + urgency only — primary CTAs, the guarantee block, error states. NEVER decorative.
- NEVER pair Gold and Terracotta on the same component. Pick one accent per element.
- Body text on Navy/Teal = Cream at 85% opacity. Body text on Cream = Slate.
- All body text must hit WCAG AA contrast on its background — verify Gold-on-Cream and Gold-on-Navy explicitly.

Typography:
  Display/Headings: Manrope (800 / 700 / 600), letter-spacing -0.02em, line-height 1.1
  Body: Inter (400 / 500), line-height 1.65
  Use next/font/google with display: swap

Spacing rhythm: 8pt baseline (8 / 16 / 24 / 40 / 64 / 96 / 144)
Container max-width: 1320px, padding-inline: 56px desktop / 32px tablet / 20px mobile

## Stack

- Next.js 15 (App Router, RSC where possible, TypeScript strict)
- Tailwind CSS v4 with brand tokens as CSS variables in globals.css
- React Three Fiber + @react-three/drei + @react-three/postprocessing for 3D
- GSAP + ScrollTrigger for scroll-driven animation
- Lenis for smooth scrolling (mounted in a Providers component)
- Framer Motion for micro-interactions and page transitions
- React Hook Form + Zod for forms
- MDX for /work and /insights content (use @next/mdx)
- next/image for all images, AVIF preferred
- Vercel Analytics + Plausible (env-flagged)

## Performance budget (enforce, do not exceed)

- LCP < 1.8s on 4G
- Initial JS gzipped < 200 KB
- Hero .glb gzipped < 600 KB (Draco + Meshopt compressed)
- Lighthouse Performance ≥ 90 mobile, ≥ 95 desktop

Patterns:
- 3D scene must be dynamic() imported with { ssr: false } and Suspense fallback = static hero PNG (the PNG is the LCP element, not the canvas)
- prefers-reduced-motion → skip ScrollTrigger pins and skip mounting R3F entirely; show static hero
- Mobile (< 768px) → static hero by default; show "Tap to load 3D scene" button to opt in
- Postprocessing only on desktop with full motion enabled
- Use next/dynamic for heavy components (3D, GSAP timelines)
- Treeshake imports from drei (e.g., import { Environment } from '@react-three/drei' — never barrel imports if avoidable)

## Information architecture

/                → Home (manifesto + proof)
/services        → 4 pillars: Design, Build, Outfit, Certify & Operate
/work            → Case studies, filterable by industry via URL params
/work/[slug]     → MDX case study
/process         → 5-phase delivery, horizontal scroll on desktop
/about           → Origin story (Sachin Gupta Buildcon → Nuvexa)
/insights        → Blog (MDX)
/insights/[slug] → MDX article
/contact         → Multi-step form, persona-routed

## Components to build (atomic, reusable)

primitives:    Button (primary/outline/ghost), Eyebrow, Container, Section, Heading, BodyText
navigation:    Nav (transparent → solid on scroll), Footer, MobileMenu
hero:          HeroScene (R3F), HeroFallback (PNG), HeroCopy
3d:            CampusModel.tsx (loads /public/models/campus.glb, Draco), Lights, Camera rig
scroll:        ScrollProvider (Lenis), useScrollProgress hook, PinnedSection
content cards: ServiceCard, ProjectCard, StatCounter, QuoteBlock, GuaranteeBlock
form:          MultiStepForm, FormStep, PersonaSelector, BookingConfirmation
motion:        FadeUp, BlueprintReveal (gold corner ticks animate in), CursorCrosshair (desktop only)

## File structure

app/
  (site)/
    layout.tsx          ← Nav + Footer + Lenis provider
    page.tsx            ← Home
    services/page.tsx
    work/
      page.tsx          ← index with filtering
      [slug]/page.tsx   ← MDX renderer
    process/page.tsx
    about/page.tsx
    insights/
      page.tsx
      [slug]/page.tsx
    contact/page.tsx
  api/
    contact/route.ts    ← Resend email + Slack webhook
  layout.tsx            ← root, fonts
  globals.css           ← brand tokens, base reset

components/
  primitives/
  hero/
  3d/
  scroll/
  cards/
  form/
  motion/

content/
  work/                 ← MDX case studies
  insights/             ← MDX articles

lib/
  motion.ts             ← shared GSAP timelines
  schemas.ts            ← Zod schemas
  brand.ts              ← color/font tokens for JS

public/
  models/campus.glb     ← Draco + Meshopt compressed
  hero-fallback.avif
  brand/                ← logos from existing /Logo-transparent.png etc.

## Tasks for this initial pass

1. Scaffold Next.js 15 + TS + Tailwind v4 + ESLint
2. Set up brand tokens in globals.css and tailwind.config.ts
3. Install all dependencies listed above
4. Build the layout, Nav (with scroll-state), Footer, Lenis provider
5. Build the Home page with STATIC hero (PNG) + all 9 sections per the spec below
6. Stub out the other 6 pages with placeholder content but correct routing
7. Set up MDX pipeline with one example case study and one example article
8. Wire the contact form with Zod validation (Resend integration can be a TODO)
9. Add Lighthouse CI config targeting the perf budget
10. Add a README.md with setup, env vars, and deployment notes

Do NOT add the 3D scene yet — that comes in pass 2 after the static site is verified.

## Home page sections (build all 9 in this pass)

1. Hero — Static PNG fallback. H1: "Your campus. Built once. Built right." Sub: "Design, build, fit-out, certify — under one contract, on a date you can sue us for." CTAs: "Book a 45-min assessment" (terracotta filled) + "See our 50+ campus handovers" (navy outline). Below: 3 micro-stats (50+ campuses · 100% on-time · ₹200Cr+ delivered).

2. Logo strip — marquee of client names (use placeholders), greyscale, 50% opacity, hover removes opacity.

3. The Problem — pinned. Heading types in via SplitText animation: "Indian institutions don't need 12 vendors." 3 stats below tick up (73% over budget, 2.4× timeline overrun, 6–12 vendors per project) only when in view, only once.

4. The Nuvexa Standard — full-bleed navy. Centered: "One contract. One PM. One invoice. One penalty clause if we miss the date." 4 cards below (Single-Point Accountability, Guaranteed Timelines, Builder Heritage, End-to-End Stack). Cards have a 4px gold top-border. On hover: gold tick marks animate in at the 4 corners of the card (the "blueprint corner crop" motif). Card background = navy.soft (#143560).

5. How we build a campus — 5-phase scroll narrative. For pass 1, build it as a vertical timeline with 5 nodes (Survey → Design → Build → Fit-out → Handover). In pass 2, this becomes a pinned R3F scene driven by ScrollTrigger.

6. Proof grid — 6 case study tiles, image-led, hover reveals project name + days delivered + ₹ value.

7. The Guarantee — full-bleed cream. One sentence in Manrope ExtraBold, navy, 64–96px: "If we miss your handover date, you don't pay until we deliver. In writing." A single 2px terracotta dimension-line draws across underneath as the section enters view. Small print link in slate: "Read the standard contract clause →".

8. Persona-routed CTAs — three doors as cards: "I'm building reputation" / "I'm closing compliance gaps" / "I'm scaling fast" → each routes to /contact?persona=legacy|guardian|scale.

9. CTA banner + Footer.

## Voice samples to seed copy

H1: "Your campus. Built once. Built right."
Sub: "Design, build, fit-out, certify — under one contract, on a date you can sue us for."
Card title: "Single-Point Accountability"
Card body: "One PM owns every milestone. One invoice covers every line. When something slips, you call one number — not twelve."
Stat label: "50+ campuses handed over"
Guarantee: "Miss the date and we don't get paid. In writing, in the contract."
Banned: "We are passionate about building world-class educational ecosystems."

## Logo & brand assets

Use the existing /Logo-transparent.png as a placeholder. The final brand book lives at /final-brandbook/index.html in the parent project — match its color hex codes exactly.

## Deliverable

A running Next.js app on localhost:3000 with the static-hero version of the home page, all routes scaffolded, brand tokens locked, and a clean README. No 3D yet. Ship this first, verify, then we move to pass 2.
```

---

## 🎬 PASS 2 PROMPT — 3D Hero + Scroll Narrative

Run this after pass 1 is verified.

```
We're now adding the 3D layer to the Nuvexa site.

## Goal

Replace the static hero PNG with an R3F scene. Add a pinned scroll-driven 3D narrative to the "How we build a campus" section.

## Hero scene

Concept: a slowly orbiting wireframe-to-solid campus block. Gold edges (#B8933A) on a navy (#0D2B4E) background. Subtle volumetric light from the upper-left. A faint teal (#0A4A42) ground plane reflection grounds the scene.

Implementation:
- Asset: /public/models/campus-hero.glb — for now, generate a placeholder using Drei primitives (a cluster of low-poly boxes arranged as a small campus: 3 buildings + a quad). I will replace with a Blender export later.
- Scene composition: 8–12 boxes max, BoxGeometry, MeshStandardMaterial in navy.soft (#143560). Edges rendered as gold (#B8933A) line segments via <Edges>.
- Ground plane: subtle teal (#0A4A42) at low opacity, soft reflection
- Lighting: 1 directional light (upper-left, 45°, warm 4500K), 1 ambient at 0.3, 1 environment preset = 'studio' from drei
- Camera: PerspectiveCamera, position [6, 4, 8], looking at origin
- Animation: useFrame to orbit Y axis at 0.05 rad/s
- Mouse parallax: shift camera by mouse position, dampened
- Postprocessing (desktop only): Bloom on the gold edges (intensity 0.3, threshold 0.9) + slight Chromatic Aberration (offset 0.0005). DO NOT use terracotta in the 3D scene — reserve it for HTML CTAs.

Loading:
- dynamic() import with { ssr: false }
- Suspense fallback = the static hero-fallback.avif from pass 1
- prefers-reduced-motion → never mount, always static
- viewport < 768px → static by default, with a "Load interactive scene" button

Performance:
- Use <Preload all /> from drei
- Compress .glb with gltf-transform: draco + meshopt + webp textures
- Confirm bundle: scene chunk < 250 KB gzipped, .glb < 600 KB gzipped

## Scroll narrative on "How we build a campus"

A pinned section, 5 phases, each ~20vh of scroll = total 100vh pinned.

Phases (each tied to a brand surface color):
1. Survey [Navy bg] — wireframe ground plane appears, drone-style camera sweep over empty land. Gold survey grid lines.
2. Design [Navy bg] — blueprint lines extrude upward into wireframe building outlines, gold edges
3. Build [Teal bg] — wireframes fill in with solid navy.soft material, warm gold construction-light glows on edges
4. Fit-out [Teal bg] — interior windows light up (emissive cream material on small box children)
5. Handover [Cream bg] — camera pulls out, full campus visible in navy with gold edge details, soft cream backdrop, optional terracotta callout text "Delivered. On the date in your contract."

Implementation:
- One R3F canvas, ScrollTrigger pins the wrapper
- useScroll hook from drei to get scroll progress 0–1
- Map progress 0–0.2 → phase 1, 0.2–0.4 → phase 2, etc.
- Each phase tween: camera position, material opacity, emissive intensity
- Caption text on the left side cross-fades per phase

## Acceptance

- LCP still < 1.8s (the static fallback is the LCP, not the canvas)
- No layout shift when canvas mounts
- Reduced-motion users see a clean static version of both sections
- Lighthouse Performance ≥ 90 mobile / ≥ 95 desktop
- The hero canvas does not block first paint
```

---

## 🧭 PASS 3 PROMPT — Inner pages (Services, Work, Process, About)

```
Build out the four inner pages for Nuvexa using the established design system.

## /services

4 pillars: Design, Build, Outfit, Certify & Operate.

Layout: each pillar is a full-viewport section, alternating layout (image left / right). Sections are pinned briefly so the user lingers.

Each section contains:
- Pillar number (01 / 02 / 03 / 04) in gold, Manrope SemiBold, eyebrow style
- Pillar name as H2, Manrope ExtraBold, navy
- 1-paragraph description, Inter, slate
- 3-item bullet list of what's included (gold arrow → bullets)
- Small interactive visual on the opposite side:
  - Design → spinning wireframe building (R3F primitive)
  - Build → animated bar chart of timeline reduction vs industry average
  - Outfit → tiltable 3D chair (R3F)
  - Certify & Operate → animated certification seal stamping in
- "Talk to us about [pillar]" link, gold

Bottom CTA: "All four under one contract. Always. → Book your assessment"

## /work

Index page:
- Hero: "Campuses we've handed over"
- Filter bar: chips for Schools / Universities / Coaching / Skill Centers / Pre-K. Click updates URL param ?industry=universities and filters the grid.
- Grid: responsive (3-col desktop, 2 tablet, 1 mobile), image cards
- Card: full-bleed image, hover reveals scrim with project name + days delivered + ₹ value
- Click → /work/[slug]

Detail page (MDX):
- Hero image (full-bleed, 80vh)
- 3 KPI tiles below the fold (timeline, budget, scope)
- MDX body sections: The Brief / The Constraint / What We Built / What Broke and How We Recovered
- Before/after slider (use react-compare-slider)
- One quote, full-width, Manrope 32px, navy on cream, gold left-border
- "More work" → 3 next case studies

Seed with one example case study in /content/work/example-campus.mdx.

## /process

Five phases: Discovery → Design → Build → Fit-out → Handover.

Desktop: horizontal scroll, pinned. User scrolls down, the section pins, content scrolls horizontally. Background alternates Navy → Teal → Navy → Teal → Cream across the 5 phases for visual rhythm.
Mobile: vertical timeline.

Each phase card:
- Phase number (gold, large, Manrope ExtraBold)
- Phase name (cream H3 on dark, navy H3 on cream)
- Duration range
- "What we do" — 3 bullets, gold arrow markers
- "What you sign" — the contractual lock for that phase
- "What's locked at end of phase" — the deliverable

Final phase (cream background) reveals the guarantee in terracotta, Manrope ExtraBold: "Miss the handover date and the project doesn't bill until it's delivered."

## /about

Origin story.

Sections:
1. Hero: "Forty years of construction. One bet on education."
2. Timeline: vertical, blueprint-styled, with milestones from Sachin Gupta Buildcon → 2025 spinout → today
3. Founders: 3 cards with photo (placeholder), name, role, one-line philosophy
4. The Why Now: 1 paragraph on why Indian education infrastructure needs single-point accountability now
5. CTA banner

## Constraints

- Maintain perf budget: LCP < 1.8s per page
- Use the existing primitives (Button, Container, Section, etc.) — do not invent new ones
- No new colors, no new fonts
- Run a Lighthouse pass after each page; fix anything below 90 mobile
```

---

## 📨 PASS 4 PROMPT — Contact form + integrations + polish

```
Final pass: contact form, integrations, /insights scaffold, and pre-launch polish.

## /contact

Multi-step form, 3 steps with progress indicator.

Step 1: Who you are
- Persona radio cards (Trustee / Founder / Investor / Other)
- Pre-fill from URL ?persona=...

Step 2: What you need
- Multi-select: Audit / Design / Build / Outfit / Certify / Full Build / Just exploring

Step 3: Project basics
- Campus type (school / university / coaching / skill centre / pre-K)
- Target opening date (month picker)
- Approx campus size (1k / 5k / 10k / 25k+ sq ft)
- Approx budget range (under ₹5Cr / ₹5–25Cr / ₹25–100Cr / ₹100Cr+)
- Name, email, phone
- "Anything we should know" (optional)

Validation: Zod schemas in /lib/schemas.ts. Inline errors. Disable submit until valid.

On submit:
- POST to /api/contact
- Server: validate, send email via Resend (RESEND_API_KEY env), POST to Slack webhook (SLACK_WEBHOOK_URL env)
- Return 200 → show confirmation page

Confirmation page:
- "We'll be in touch within 4 working hours."
- Cal.com embed (env: NEXT_PUBLIC_CAL_LINK)
- Download link: "What to expect in your assessment.pdf"

## /insights scaffold

- Index: card grid, sorted by date desc, with category filter
- Detail: MDX renderer with reading time, table of contents (right sidebar on desktop), share buttons, "next/prev article"
- RSS feed at /rss.xml
- Auto Open Graph image generation via @vercel/og
- Seed with one example article

## Polish checklist

- 404 page (custom, on-brand)
- robots.txt + sitemap.xml (next-sitemap)
- favicon set (use the brand mark)
- Open Graph defaults in metadata
- Skip-to-content link, focus rings on all interactive elements
- Cookie banner: NO. Plausible is privacy-friendly, no consent required.
- Run axe-core accessibility scan, fix any violations
- Run Lighthouse on every route, target ≥ 90 mobile
- Test on iPhone SE, iPhone 15 Pro, iPad, 1440px desktop, 1920px desktop
- Verify reduced-motion users get a fully usable site with no broken animations

## Deploy

- Vercel project linked
- Environment variables documented in README and set in Vercel
- Custom domain pointed (assume nuvexa.in)
- ISR revalidation for /work and /insights set to 60 seconds
- Edge functions for /api/contact

Ship a final report: routes built, Lighthouse scores per route, total bundle sizes, any TODOs.
```

---

## 🛠 Notes on running this in Antigravity vs Claude Code

- **Claude Code:** paste the master prompt at the root of an empty folder, let it run, review the diff, then feed pass 2 / 3 / 4 in sequence. Use `/init` first to set up CLAUDE.md.
- **Antigravity:** same prompts work. Use the IDE preview to verify the static hero before approving pass 2. Antigravity tends to want to do too much in one shot — explicitly tell it "stop after pass 1, do not start the 3D scene."

In both cases: **review every diff before merging**. The plan is opinionated for a reason. If the agent invents a teal color or uses "passionate" in the copy, reject and re-prompt.

---

## What to give the agent that I can't put in a prompt

1. The `.glb` file for the hero campus — make in Blender or Spline, export with Draco + Meshopt. If you don't have one yet, the agent will use primitives in pass 2 as a placeholder.
2. Real client logos for the marquee strip — even 4–6 is enough.
3. Real case study photos (or hi-res renders) for `/work`.
4. Founder headshots for `/about`.
5. The final standard contract clause to link from the guarantee block.

Get those 5 ready in parallel while pass 1 builds. That's the bottleneck — not the code.
