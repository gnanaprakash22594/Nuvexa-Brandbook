# Homepage Copy — FINAL ENFORCEMENT PROMPT (Antigravity)

The previous two revision prompts were not fully applied. The live site still contains language and stats that were explicitly flagged for removal. Treat this as a mandatory cleanup pass. Do not partially apply. Do not skip sections. Do not preserve any of the banned strings below for any reason.

---

## NON-NEGOTIABLE RULE

The following strings must return ZERO results in a global search across the entire codebase (all `.tsx`, `.ts`, `.jsx`, `.js`, `.md`, `.mdx`, `.html`, `.json` content files):

```
sue us
sue you
penalty
penalties
liquidated
lawsuit
contract clause
standard contract clause
Read the standard contract
you don't pay until we deliver
in writing
60-day
60 day guarantee
Sachin
Buildcon
Sachin Gupta
₹200Cr
200Cr+
22 schools
50+ handovers
₹85Cr
85Cr
12 vendors
6 to 12 vendors
6–12 vendors
6-12 vendors
45-min assessment
Book a 45-min assessment
Book your 45-min assessment
on a date you can sue us for
```

If any of these appear in the codebase after your pass, the pass has failed. Re-run until grep returns zero matches across all files.

---

## SECTION-BY-SECTION ENFORCED REPLACEMENTS

### 1. HERO SUBHEAD

**Currently on site (WRONG):** "Design, build, fit-out, certify. Under one contract. On a date you can sue us for."

**Replace with:** "Design, build, fit-out, certify. Under one contract. On a date your academic calendar can rely on."

### 2. HERO STATS ROW

**Currently on site (WRONG):** "22 schools · 100% on-time · ₹85Cr delivered"

**Replace with:** "100+ projects delivered · 100% on-time · 10L+ sq.ft delivered"

### 3. HERO SECONDARY CTA

**Currently on site (WRONG):** "See our 50+ handovers"

**Replace with:** "See our project track record"

### 4. PROBLEM SECTION H2

**Currently on site (WRONG):** "Indian institutions don't need 12 vendors."

**Replace with:** "Indian institutions don't need 25 vendors. They need one accountable team."

### 5. PROBLEM SECTION STATS ROW

**Currently on site (WRONG):**
- "73% of Indian campus projects exceed budget"
- "2.4× average timeline overrun"
- "6 to 12 vendors per typical project"

**Replace with:**
- "73% of Indian campus projects exceed budget" (keep)
- "2.4× average timeline overrun" (keep)
- "20 to 30 vendors per typical campus project" (replace third stat)

### 6. PENALTY/LAWSUIT BANNER (DELETE THE ENTIRE SECTION)

**Currently on site (WRONG, must be deleted in full):**
> "If we miss your handover date, you don't pay until we deliver. In writing."
> "Read the standard contract clause →"

**Action:** Delete this entire section. Do not replace with another penalty-flavored variant. If a section break is needed for visual rhythm, replace with this section instead:

**New replacement section H2:** "We don't manage vendors. We are the vendor."

**New replacement section body:** "Single contract. Single PM. Single delivery date. The team that quotes the project is the team that builds it. No outsourced trades. No subcontractor relay race."

**No CTA below.** No "read the contract" link. No legal language anywhere.

### 7. "THE NUVEXA STANDARD" SECTION H2

**Currently on site (WRONG):** "One contract. One PM. One invoice. One penalty clause if we miss the date."

**Replace with:** "One contract. One PM. One invoice. One accountable team from planning to handover."

### 8. NUVEXA STANDARD — CARD 02 (GUARANTEED TIMELINES)

**Currently on site (WRONG):** "Every project comes with a contractual handover date. Miss it, and we absorb cost until delivery. No negotiation."

**Replace with:**
- Card title: "Date-Locked Delivery"
- Card body: "Every project ships with a contractual handover date built around your academic calendar. Single-contract structure removes the vendor handoffs that cause most slippage."

### 9. NUVEXA STANDARD — CARD 03 (BUILDER HERITAGE) — CRITICAL FIX

**Currently on site (WRONG, must be removed in full):** "25 years as Sachin Gupta Buildcon. ₹200Cr+ delivered. We don't outsource the hard parts. We built the hard parts."

**The Sachin Gupta Buildcon name and the ₹200Cr figure must NOT appear anywhere on the public site.** This was a strategic decision: leverage the parent-company depth without surfacing the parent-company name.

**Replace with:**
- Card title: "Execution Depth"
- Card body: "100+ construction projects behind us across institutional, commercial, and infrastructure builds. We don't outsource the hard parts. We built the hard parts."

### 10. NUVEXA STANDARD — CARD 04 (END-TO-END STACK)

**Currently on site:** "Survey, design, construct, fit-out, certify, hand over. Four pillars. One contract. Zero finger-pointing."

**Status:** Acceptable. Minor polish — change "Four pillars" since the new offer has 3 service buckets, not 4 pillars.

**Replace with:** "Survey, design, construct, fit-out, certify, hand over. One contract. Zero finger-pointing."

### 11. NAVIGATION CTA BUTTON

**Currently on site:** "Book Discovery Call"

**Status:** Keep as is — this is correct.

### 12. PRIMARY HERO CTA

**Currently on site:** "Book a 45-min discovery call"

**Status:** Keep as is — this is correct.

---

## REPEAT OF EARLIER GLOBAL RULES (still must be enforced)

These were specified in HOMEPAGE_COPY_REVISION_PROMPT.md and HOMEPAGE_COPY_REVISION_V2.md but are not yet fully applied:

### Em dashes (—)
Zero em dashes anywhere on the site. Apply the 5 replacement rules from V2 (period for separate thoughts, comma for clarifiers, colon for definitions/lists, "to" for number ranges, preserve compound hyphens like "45-min" / "fit-out" / "in-house").

### En dashes (–) in number ranges
Replace with the word "to". "20–30" becomes "20 to 30". "14–18 months" becomes "14 to 18 months". "6–8 acres" becomes "6 to 8 acres".

### Service buckets
The 11 services must be grouped into 3 buckets (Greenfield & Turnkey Delivery / Renovation, Repair & Upgrade / Diagnostics, Audit & Advisory) per the section 3 spec in HOMEPAGE_COPY_REVISION_PROMPT.md. Not 4 pillars. Not 11 flat bullets.

### Verticals section
K-12 featured large with the 3 case studies. Higher Ed / Healthcare / Corporate marked as "Selective engagements" — not as delivered verticals.

### Proof section
3 full-width feature blocks. Not a 3-card grid. Headline: "Three schools. Three handovers. Zero delays." Below the 3 features, a horizontal strip linking to the broader 100+ project track record.

### FAQ
Remove the "What happens if you miss the contracted date?" question entirely. Remove all liquidated damages references. Add the "you've only delivered 3 schools, why should we trust you" question with the 100+ projects answer.

---

## EXECUTION ORDER

1. Run a global grep across ALL files (not just homepage component) for every banned string in the "NON-NEGOTIABLE RULE" block. List every file + line where each match appears.
2. Replace each match per the section-by-section spec above.
3. Re-run the grep. If any banned string still appears, repeat step 2 until grep returns zero matches.
4. Run a separate grep for `—` (em dash) and `–` (en dash). Both should return zero matches in user-facing copy. Hyphens in compound modifiers stay.
5. Visually verify the live page at `/` matches every "Replace with" in this prompt — eyeball the hero, problem section, the deleted penalty banner, the Nuvexa Standard cards 1-4, and the FAQ.

---

## SUCCESS TEST

Open the homepage in a browser. Ctrl+F search for each of these — every single one must return ZERO matches:

- `sue`
- `penalty`
- `Sachin`
- `Buildcon`
- `200Cr`
- `22 schools`
- `85Cr`
- `50+ handovers`
- `12 vendors`
- `6 to 12`
- `45-min assessment`
- `—` (em dash character)

If any of these returns even one match in the rendered page, the pass has failed.

---

## STOP CONDITION

If after one pass the grep still returns matches for the banned strings, do NOT keep patching individual files in isolation. Stop. List every remaining match with file path and line number. The repo likely has the old copy duplicated in multiple components (hero variants, sections, MDX content, JSON content files). All copies must be updated, not just the most obvious one. This is the reason previous passes regressed — only the most visible component was edited while duplicate copies in sibling files persisted.

---

## WHY THIS MATTERS (context for the agent)

The "sue us" and "penalty" language is not a brand voice choice. It is a legal liability the founder has explicitly disowned because liquidated damages clauses are not standard practice in Indian institutional construction. Every time this language ships, it creates real exposure for the business. This is not stylistic feedback. This is a hard requirement.

The "Sachin Gupta Buildcon" name appearing on a public page is a positioning leak. Nuvexa is the brand being launched. The parent company's depth is leverage to be implied through the "100+ projects" stat, not surfaced by name. Naming the parent on the site collapses the entire positioning strategy.

The 22 / 50+ / ₹85Cr stats are factually incorrect. The real numbers are 3 school projects (deep proof) plus 100+ broader construction projects (depth proof). Shipping wrong numbers on the homepage is not a copy issue. It is a credibility issue if a prospect asks to see the 22 schools and only 3 exist.

These three categories of error are why this enforcement pass exists. Apply with the seriousness of a legal/positioning fix, not a typo cleanup.
