# Nuvexa Website Redesign — Strategy & Build Plan

**Audience:** GP (solo) → execute via Claude Code / Antigravity
**Brand source of truth:** `/final-brandbook/index.html` + the locked 5-color palette
**Goal:** Premium, story-driven, 3D-anchored site that signals Creator-Hero — "we build things that endure, we stand behind every promise."

**Palette (locked):**
Navy `#0D2B4E` · Cream `#F4F4F0` · Gold `#B8933A` · Teal `#0A4A42` · Terracotta `#C1440E`

---

## 1. Positioning the Site Must Express

Nuvexa isn't a vendor. It's the only firm where the campus you tour in 3D is the campus you'll walk in 14 months later — same plan, same partner, same invoice. The site's job: prove that without saying "passionate" once.

**Three things every visitor must feel within 8 seconds:**
1. This is a builder, not a consultant.
2. There is one throat to choke (single-point accountability).
3. The deadline is in writing.

**Persona-aware CTAs (current site has zero):**
- Legacy Builder (VC, 55+) → "See campuses we've handed over"
- Guardian Operator (Trustee, 40–55) → "Audit my compliance gaps"
- Scale Machine (Founder, 30–45) → "Plan 5 campuses on one contract"

---

## 2. Tech Stack (chosen for solo leverage, not committee)

| Layer | Choice | Why over alternatives |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSG + ISR, RSC, image opt, Vercel-native. Astro is faster but worse for the interactivity you want. |
| Styling | **Tailwind v4 + CSS vars (brand tokens)** | Speed of utility + zero design drift |
| 3D core | **React Three Fiber + Drei + Postprocessing** | Tree-shakeable, full control. Spline ships ~1.5 MB runtime + scene; R3F ships only what you import. |
| Hero scene | **Custom .glb** (made in Blender or Spline → exported), Draco + Meshopt compressed | Lighter, brandable, no Spline watermark dependency |
| Scroll | **Lenis** (smooth) + **GSAP ScrollTrigger** | Industry standard for cinematic scroll |
| Micro-interactions | **Framer Motion** | Spring physics, layoutId magic |
| Forms | **React Hook Form + Zod + Resend** | Type-safe, no SaaS lock-in |
| Content | **MDX** for case studies / industries | No CMS = no monthly fee, no API call latency |
| Analytics | **Vercel Analytics + Plausible** | Privacy-friendly, no consent banner needed |
| Hosting | **Vercel** | Edge, ISR, image opt out of the box |

**Contrarian call:** Skip Spline as the runtime. Use Spline (or Blender) only as the *authoring* tool, then export `.glb` and play it in R3F. You keep the no-code editing speed and the production performance.

---

## 3. Performance Budget (non-negotiable)

| Metric | Target |
|---|---|
| LCP | < 1.8s on 4G |
| INP | < 200ms |
| CLS | < 0.05 |
| Initial JS (gzipped) | < 200 KB |
| Hero `.glb` (gzipped) | < 600 KB |
| Total hero payload | < 1.2 MB |
| Lighthouse Performance | ≥ 90 mobile, ≥ 95 desktop |

**Performance tactics built in from day 1:**
- 3D scene `dynamic()` imported, Suspense fallback = static hero PNG (LCP element is image, not canvas)
- Draco-compressed geometry, KTX2-compressed textures, instancing for repeated geometry
- `prefers-reduced-motion` → static hero (CSS only, no R3F mounted)
- Mobile (< 768px) → static hero by default, "Tap to load 3D" opt-in
- Postprocessing only on desktop with `useReducedMotion === false`
- Fonts: `next/font/google` with `display: swap` and subset

---

## 4. Information Architecture (lean it down)

**Current:** Home, About, Services, Case Studies, Industries, Process, Gallery, Contact (8 pages — Industries, Case Studies and Gallery overlap)

**Proposed:** 7 pages, tighter narrative

```
/                     Home — the manifesto + the proof
/work                 Case Studies (was: Case Studies + Gallery merged) — filterable by industry
/services             What We Build — 4 pillars, not 6 cards
/process              How We Deliver — the 5-step accountability machine
/about                Origin — Sachin Gupta Buildcon → Nuvexa
/insights             Blog/POVs (NEW — owned media, SEO compounds)
/contact              Book Assessment (multi-step, persona-routed)
```

**Why kill Industries as a top-level:** It's a filter on `/work`, not a page. One less click, one less stale page to maintain.

**Why add /insights:** You're a solo operator who needs SEO compounding. Content is the only marketing channel that pays you back. Even 1 post/quarter = 4 ranking pages/year.

---

## 5. The Story Arc (the spine of the redesign)

Every page is a chapter. Same metaphor pulled through every scroll.

**Concept: "Living Blueprint"**

The brand book calls Nuvexa Creator-Hero. The visual story:
- It begins as **lines** (blueprint — the promise)
- It builds into **forms** (construction — the work)
- It ends as **light** (handover — the outcome)

This shows up everywhere:
- Hero: a wireframe campus, gold lines on navy/cream, that *fills in* with material as you scroll
- Section transitions: blueprint dimension lines become the dividers between sections
- Stat counters: numbers tick up like a survey reading
- Hover states: cards reveal a "blueprint corner crop" on the corners (gold tick marks)
- Cursor: small crosshair on desktop

This is the design system, not just the hero. It scales across pages and assets (decks, proposals, social).

---

## 6. Page-by-Page Blueprint

### 6.1 Home (`/`)

**Above the fold (LCP):**
- Left: H1 `Your campus. Built once. Built right.` (replace "Transformed. Guaranteed." — too generic)
- Sub: One sentence, specific. "Design, build, fit-out, certify — under one contract, on a date you can sue us for."
- Two CTAs: `Book a 45-min assessment` (primary, terracotta) + `See 50+ campuses we've handed over` (outline, navy)
- Right: 3D hero scene — slowly orbiting wireframe campus block, gold edges, navy foundation. Mouse parallax, scroll = camera pulls back to reveal the full campus.
- Bottom: micro-stats strip (50+ campuses · 100% on-time · ₹200Cr+ delivered)

**Section 2 — Logo strip:** real client names. Greyscale, marquee, no animation hack — pure CSS.

**Section 3 — The Problem (scroll-pinned):**
A single line types in: "Indian institutions don't need 12 vendors." Below it: 3 stats appear one by one as you scroll (73% over budget · 2.4× timeline overrun · 6–12 vendors per project). Numbers tick up only when in view.

**Section 4 — The Nuvexa Standard (the hero of the page):**
Full-bleed navy. Centered: "One contract. One PM. One invoice. One penalty clause if we miss the date." Below: 4 cards (Single-Point Accountability · Guaranteed Timelines · Builder Heritage · End-to-End Stack). On hover, gold tick marks appear at corners of each card.

**Section 5 — How we build a campus (3D scroll-narrative):**
This is the showcase. Pin a 3D scene, scroll drives 5 phases:
1. Survey (drone wireframe sweep)
2. Design (blueprint unfolds)
3. Build (extrude foundation → walls → roof)
4. Fit-out (interior light turns on)
5. Handover (camera pulls out to full campus, students walking)

Use GSAP ScrollTrigger to drive R3F camera + animation. ~30s scroll experience. This is the story.

**Section 6 — Proof grid:**
6 case studies as image tiles, hover reveals: campus name, days delivered, ₹ value. Click → `/work/[slug]`.

**Section 7 — The Guarantee block (terracotta accent):**
Full-bleed cream. One bold sentence in navy: *"If we miss your handover date, you don't pay until we deliver. In writing."* A single terracotta dimension-line draws across underneath. Small print link to the standard contract clause.

**Section 8 — Persona-routed CTAs:**
Three doors: "I'm building reputation" / "I'm closing compliance gaps" / "I'm scaling fast" → each routes to a different `/contact` pre-fill.

**Section 9 — CTA banner + Footer.**

---

### 6.2 Services (`/services`)

Reframe as **4 pillars** (matches brand book), not 6 generic cards:

1. **Design** — Architecture, master planning, 3D walkthroughs
2. **Build** — Construction, project management, vendor consolidation
3. **Outfit** — Interiors, furniture, IT/AV, smart classrooms
4. **Certify & Operate** — NEP/NAAC/CBSE/UGC compliance + ops handover

Each pillar = one full-viewport section, alternating left/right layout, with a small 3D module per pillar (a chair for Outfit, a cert seal for Certify, etc.). Pinned scroll, parallax product shots.

---

### 6.3 Work (`/work`)

- Top: filter chips by industry (Schools · Universities · Coaching · Skill Centers · Pre-K) — these are also URL params for SEO (`/work?industry=universities`)
- Grid: large image cards, no text on card, hover reveals the project name + KPI (days, ₹, students seated)
- Each project page (`/work/[slug]`) is MDX:
  - Hero image (full-bleed)
  - 3 KPI tiles (timeline, budget, scope)
  - "The brief" / "The constraint" / "What we built" / "What broke and how we recovered" (this honesty is the differentiator)
  - Before/after slider
  - Quote from the institution
  - 3 next case studies

---

### 6.4 Process (`/process`)

The 5 phases as a horizontal scroll experience (desktop) or vertical timeline (mobile). Each phase = a card with: what we do · what you sign · what's locked · timeline range.

This is the place to put the **liability statement** in plain English. Most firms hide it. Nuvexa puts it in the URL.

---

### 6.5 About (`/about`)

Origin story: Sachin Gupta Buildcon → 40+ years of construction → 2025 spinout into education infrastructure. Show the timeline as a vertical 3D blueprint scroll. End with the team (faces > titles).

---

### 6.6 Insights (`/insights`)

Blog. MDX. Categories: Compliance / Cost / Design / Industry. RSS. Open Graph images auto-generated via Vercel OG.

---

### 6.7 Contact (`/contact`)

Multi-step form (3 steps, progress indicator):
1. Who you are (Trustee / Founder / VC / Other)
2. What you need (Audit / Build / Both / Just exploring)
3. Project basics (campus type, target opening date, budget range)

Submit → Resend email + Slack webhook. Confirmation page with 2 things: a calendar link (Cal.com embed) and a downloadable "What to expect in your assessment" PDF.

---

## 7. Design Tokens (paste into Tailwind config)

```js
colors: {
  navy:       { DEFAULT: '#0D2B4E', soft: '#143560', deep: '#081C36' },
  cream:      { DEFAULT: '#F4F4F0', warm: '#FAFAF6' },
  gold:       { DEFAULT: '#B8933A', soft: '#D4AF5A' },
  teal:       { DEFAULT: '#0A4A42', soft: '#0D6B5E' },
  terracotta: { DEFAULT: '#C1440E', deep: '#9B3409' },
  slate:      '#334155',
  steel:      '#84929F',
},
fontFamily: {
  display: ['Manrope', 'sans-serif'],
  body:    ['Inter',   'sans-serif'],
},
```

**Type scale:** Manrope ExtraBold for H1/H2, Manrope SemiBold for H3/H4, Inter for body. Display 800 / Heading 700 / Body 400 / UI label 600. Letter-spacing -0.02em on headings.

**Spacing rhythm:** 8pt baseline (8/16/24/40/64/96/144).

**Color rules (locked — 5-color discipline):**
- **Navy + Cream** is the primary surface pair. ~90% of the site lives here. Lead with it.
- **Teal** is the *only* alternative dark surface to Navy. Use it to break monotony in long scrolls — alternate sections (Navy → Teal → Cream → Navy). Never put Navy and Teal blocks adjacent on the same viewport.
- **Gold** is a premium accent only — eyebrows, borders, hover ticks, stat dividers, the guarantee underline. Never a fill exceeding ~5% of any viewport. Never a button background.
- **Terracotta** is action + urgency only — primary CTAs, the guarantee block, error states, structural commitments. Never decorative.
- **Never pair Gold and Terracotta on the same component.** Pick one accent per element.
- Slate is body text on Cream; Cream-at-85% is body text on Navy/Teal.
- All body text must hit WCAG AA contrast on its background. Verify Gold-on-Cream and Gold-on-Navy explicitly — Gold often fails AA at small sizes; cap minimum size at 13px / use only for short uppercase labels.

**Voice rules (locked):**
- Specific numbers > adjectives
- Short sentences
- Lead with accountability
- Banned: passionate, holistic, ecosystem, synergy, visionary, transformative (yes, even "transformed" as filler)

---

## 8. Animation & Interaction Inventory

**Macro (page-level):**
- Lenis smooth scroll
- GSAP ScrollTrigger pins for: Hero (camera reveal), How-we-build (5-phase scroll), Process (horizontal pin)
- R3F scene state synced to scroll progress
- Page transitions: cream sweep with gold dimension line that draws across viewport (Framer Motion)

**Micro (component-level):**
- Buttons: 200ms ease-out, slight Y lift on hover, arrow translates
- Cards: corner crop appears on hover (gold ticks at 4 corners — the blueprint motif)
- Stat counters: ease-out cubic, only triggers in view, only once
- Cursor (desktop only): tiny crosshair that grows to a circle on hover targets
- Image tiles: subtle scale + brightness lift on hover
- Forms: floating labels, inline validation, success state morphs the button

**All interactions respect `prefers-reduced-motion`.** No exceptions.

---

## 9. What I'd skip (so you don't waste time)

- Don't build a CMS. MDX in repo is faster, free, version-controlled.
- Don't build dark mode. Not on-brand (Navy/Cream is the pair).
- Don't add a chatbot. You're a high-touch B2B sale — chat costs you trust.
- Don't translate to Hindi yet. Your buyers read English.
- Don't add testimonial carousels. Use one quote per page max, in heavy weight.
- Don't fake the 3D — if you can't make it premium, ship a beautiful static hero. A bad 3D scene reads worse than no 3D.

---

## 10. Build Sequence (what to ship first)

Week 1: scaffold + design tokens + nav/footer + Home (no 3D yet, static hero)
Week 2: 3D hero + scroll narrative on Home
Week 3: Services + Work index + one Work detail
Week 4: Process + About + Contact + Insights scaffold
Week 5: polish, perf budget enforcement, accessibility audit, deploy

Ship `/` and `/contact` on day 1 of week 2 — those two close deals. Everything else is a supporting actor.

---

The full Claude Code / Antigravity build prompt is in **`BUILD_PROMPT.md`** — paste that into a fresh repo and let it scaffold.
