# HERO 3D — STOP, RESET, DECIDE (Antigravity Prompt)

We have iterated on this scroll-based 3D hero 4+ times. Every iteration produces "novice and random" middle scenes and the final scene has now degraded to a basic primitive door in a void. The pattern is clear: this approach is not working.

**Do not write another patch. Do not iterate on the current code.** The problem is not code quality. The problem is that we are trying to procedurally generate architectural 3D scenes through code, and code-generated primitives will always look novice no matter how many fixes we layer on.

---

## DIAGNOSIS

What's actually wrong:

1. The middle scenes are abstract primitive geometry (boxes, planes, cylinders, panels) being passed off as architectural environments. They will never read as "campus interior" because they are not modeled as one.

2. The final scene is now a single blue door floating in black. It used to be a corridor with warm light and a green path. We have actively regressed.

3. We are trying to build production-quality scroll-driven architectural 3D using a coding agent without source 3D assets. This is the wrong tool for the job.

4. The brief has shifted between "interactive 3D" / "looping video" / "scroll story" without ever locking the asset strategy. Code iterations cannot fix an asset problem.

---

## STOP

Before writing any more code:

1. `git stash` or branch away from the current broken state
2. Do not attempt another in-place fix
3. Read this entire document and respond with which path (A, B, or C) you are taking

---

## THREE PATHS — pick exactly one

### Path A — Single Cinematic Looping Video (FASTEST, RECOMMENDED)

Replace the entire scroll-driven 3D system with a single 6-second seamless looping MP4/WebM as the hero background. No scroll story. No middle scenes. No final scene. Just one beautifully rendered campus loop with the headline + CTAs over it.

**Why this is the right call:** You already have a brief for this (HERO_VIDEO_PROMPTS.md). It works on mobile without modification. It cannot regress between iterations. It looks premium with one good asset. Total scope: replace one component, add a gradient scrim, fix text legibility.

**Execution:** Delete the entire scroll-driven hero system (HeroWalkthrough, CameraRig, all SceneXxx files, Lenis wiring, ScrollTrigger pinning for the hero). Replace with a `<video>` element + scrim. Use the existing HERO_VIDEO_PROMPTS.md spec.

**Time to ship:** 1 day if the video asset exists, 3 days if it needs to be commissioned.

### Path B — Properly Modeled 3D Scenes from a 3D Artist

Keep the scroll-driven 3D architecture but replace ALL generated primitives with properly modeled GLB scenes from a 3D artist (Blender or Cinema4D). The coding agent's job becomes: load 5 GLB files, choreograph camera + scroll, wire text overlays. The agent does NOT model the scenes.

**Why this works:** The reason every iteration looks novice is that the scenes themselves are novice. A real 3D artist building proper architectural environments solves the root cause.

**Execution:** Commission 5 GLB scenes from a 3D artist (brief them with the existing scene specs). Coding agent's scope shrinks to: scene loader, camera rig with Catmull spline through 5 waypoints, text overlay scrub, performance pass.

**Time to ship:** 2–3 weeks (1–2 weeks for assets, 1 week for integration).

### Path C — Spline-Authored Scenes (MIDDLE GROUND)

Build the 5 scenes inside Spline's visual editor (not in code). Spline gives you proper materials, lighting, and modeled geometry without needing a full 3D artist. Export each scene as a Spline scene URL or GLB. Coding agent loads them and drives scroll.

**Why this works for solo operators:** You can author this yourself in Spline in a weekend if you have the visual eye. Spline handles the lighting and material work that's making code-generated scenes look amateur.

**Execution:** You author 5 Spline scenes. Coding agent integrates them with scroll-driven camera and text overlays. Same architecture as Path B, different asset source.

**Time to ship:** 1 week if you author the Spline scenes, 2 weeks if outsourced.

---

## DO NOT ATTEMPT

- Another round of "fix the current scenes with new primitives"
- Adding more code-generated geometry to scenes 2, 3, 4
- Patching the broken final scene with another fade or overlay
- Any more incremental fixes to HeroWalkthrough.tsx in its current form

These have been tried. They do not work. Continuing will burn more time without changing the outcome.

---

## YOUR FIRST RESPONSE

Reply with ONLY this:

> **Path chosen: [A / B / C]**
>
> **Reason:** [one sentence]
>
> **First action:** [one sentence — what you will do in the next 30 minutes]

Do not start writing code until I confirm the path. Do not touch HeroWalkthrough.tsx until the path is confirmed.

---

## Strategist's recommendation

Pick **Path A** unless you have a 3D artist already lined up or you personally have time to author Spline scenes this week.

Reasons:
- The looping video approach has been your client's stated preference (they referenced wanting "a looping video like this")
- It is the only path that ships in days, not weeks
- It cannot regress — once the video asset is right, the hero is done
- You already have a brief and prompts for it (HERO_VIDEO_PROMPTS.md)
- Mobile-friendly without architectural changes
- Total dependency surface shrinks dramatically (no GSAP ScrollTrigger, no R3F, no Lenis for the hero)

Path B and C are valid if you specifically want a scroll-driven story in the hero. But after 4+ failed iterations, the realistic answer is: you don't need a scroll story in the hero. You need a hero that converts. A 6-second looping campus video with a strong headline and clear CTAs converts. A broken scroll story does not.

---

## STOP CONDITION

If after picking a path you find yourself in a 3rd iteration of the same scope, STOP and revisit this document. The fix is not more iteration. The fix is the right asset strategy.
