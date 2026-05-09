# Prepify — Final Defense Presentation

**Project:** Prepify — A Community Driven Platform for Handwritten Academic Notes
**Student:** Shorno Kamal Roy (222-15-6141)
**Supervisor:** Md. Sazzadur Ahamed, Assistant Professor
**Co-Supervisor:** Md. Ashraful Islam Talukder, Lecturer
**Department:** CSE, Daffodil International University
**Date:** May 2026

**Total slides:** 21 (12–15 minutes presentation + 3–5 minutes Q&A)
**Focus area:** Novelty of the Work (Slides 11–15)

---

## Common Visual Style Preface for All AI-Generated Slide Visuals

Append this to the front of any new visual prompt for visual consistency across the deck. It differs slightly from the report-diagram preface — presentation visuals need bolder, simpler, more presentation-friendly designs:

> Modern presentation visual, 16:9 aspect ratio, large legible elements designed for projection, white or very light gray (`#F8FAFC`) background, flat vector illustration style, no gradients, no 3D, no drop shadows, sharp clean edges, generous whitespace, sans-serif typography (Inter, Helvetica, or SF Pro), large readable type sizing (minimum 24 pt for body text and 36 pt for titles when scaled to 1920×1080), bold accent colors limited to this palette: deep slate `#0F172A` for primary text, blue `#2563EB` for client / user side, indigo `#4F46E5` for server / application logic, emerald `#059669` for data / persistence, amber `#F59E0B` for third-party services, rose `#E11D48` for AI / novel features, light gray `#F1F5F9` for grouping containers, red `#DC2626` for problems / negatives, green `#16A34A` for solutions / positives. No clip art, no decorative people figures, no stock-photo gradients. Every text label must be horizontal and immediately readable.

---

# SLIDES

---

## Slide 1 — Title Slide

**On slide:**

- **Prepify**
- A Community Driven Platform for Handwritten Academic Notes
- Final Year Design Project — Phase II Defense
- **Shorno Kamal Roy** — 222-15-6141
- **Supervisor:** Md. Sazzadur Ahamed, Assistant Professor
- **Co-Supervisor:** Md. Ashraful Islam Talukder, Lecturer
- Department of CSE, Daffodil International University
- May 2026

**Visual prompt (Slide 1):**

> 16:9 title slide for an academic project defense. Clean white background with a subtle light-gray decorative element (geometric, not floral) in one corner. Centered: large bold title "Prepify" in indigo `#4F46E5` (96 pt equivalent), subtitle "A Community Driven Platform for Handwritten Academic Notes" in slate `#0F172A` (40 pt), tag line "Final Year Design Project — Phase II Defense" in muted gray (28 pt). Bottom-left corner: student name and ID in two lines. Bottom-right corner: small Daffodil International University text logo. Top-right: small "May 2026" date stamp. No icons, no background images, professional academic aesthetic.

---

## Slide 2 — Introduction

**On slide:**

- Handwritten notes are the primary study material in Bangladeshi universities
- Currently shared informally via WhatsApp, Telegram, Facebook groups
- Three persistent pain points:
  1. Notes get **buried** under unrelated chats
  2. **No search**, no tagging, no organization
  3. **No quality signal** — good and bad notes look identical
- **Prepify** turns this fragmented behaviour into a structured, free, AI-assisted platform

**Speaker notes:** "Every semester, students scramble to collect handwritten notes from seniors. They post requests in WhatsApp groups and scroll through hundreds of messages. The notes already exist — what doesn't exist is a place to organize, rank, and reuse them. Prepify is built around this insight."

**Visual prompt (Slide 2 — Problem Comparison):**

> Side-by-side 16:9 comparison illustration titled "From Chaos to Structure". Left half (50% width, light red `#FEF2F2` background, red `#DC2626` border on top with "BEFORE" label): a stylized illustration of a messy phone chat interface showing a chaotic stream of overlapping chat bubbles labeled "anyone has CSE 313 notes?", "midterm tomorrow plz help", "who has math notes from sir Karim?", "lost the link", "send again pls", with three of the bubbles partially covered by newer ones to imply burial. Add three small red icons labeled "Buried", "Unsearchable", "No Quality Signal" running down the left edge. Right half (50% width, light green `#F0FDF4` background, green `#16A34A` border on top with "AFTER" label): a stylized illustration of a clean Prepify-like card grid showing 6 organized note cards in a 2×3 layout, each card with a course tag (CSE 313, MAT 102, EEE 211, etc.), a like count badge, and a small avatar. Three small green icons labeled "Organized", "Searchable", "Community-Ranked" running down the right edge. Center divider: a vertical arrow pointing right with the word "Prepify" inside an indigo `#4F46E5` rounded badge. No gradients, flat vector style.

---

## Slide 3 — Objectives

**On slide:**

1. Build a **free** community platform for uploading and discovering handwritten notes
2. Implement **engagement features** — likes, comments, follows, leaderboard, streaks, badges
3. Build a **moderation pipeline** with role-based dashboards
4. Integrate a **multimodal LLM** to explain handwritten notes directly from images
5. Support **bookmarks and curated public collections** for exam preparation
6. Deliver a **responsive, accessible** interface within a student developer's budget

**Visual prompt (Slide 3 — Objectives Grid):**

> 16:9 slide titled "Objectives" in slate top-left. Six numbered objective cards arranged in a 3×2 grid, evenly spaced, each card 1/3 of the slide width. Each card is a rounded rectangle (16 px corners) with white fill, 2 px slate border, 24 px internal padding. Card structure top to bottom: large numbered circle (1–6) in indigo `#4F46E5` filled with white number, then a 2-3 word bold title in slate, then a one-line description in muted gray. Cards in order:
>
> 1. **Free Platform** — Upload and discover handwritten notes without paywall
> 2. **Engagement Loop** — Likes, comments, follows, leaderboard, streaks, badges
> 3. **Moderation Pipeline** — Role-based dashboards with approval workflow
> 4. **Multimodal AI** — Gemini-powered explanations directly from images
> 5. **Curated Collections** — Bookmarks and public exam-prep playlists
> 6. **Responsive UX** — Mobile-first design within an $8/month budget
>
> Add one small monoline icon at the top-right corner of each card matching the theme (folder/star/shield/sparkles/bookmark/devices). Flat vector, no gradients.

---

## Slide 4 — Background Study (Part 1: Academic Literature)

**On slide:**

| Author / Work | Contribution |
|---|---|
| Chatti et al. (2010) | Personal Learning Environment framework |
| Attwell (2007) | Communities improve resource quality |
| Getenet et al. (2024) | Engagement higher when platform fits existing habits |
| Vaswani et al. (2017) | Transformer architecture → modern multimodal LLMs |
| Google DeepMind (2023) | Gemini multimodal models read images + Bangla |
| Smith (2007) | Tesseract OCR — strong on print, weak on handwriting |

**Speaker notes:** "The literature points in two directions. First, students benefit from personalized, community-driven environments. Second, multimodal LLMs have closed the gap that OCR could never close on irregular handwriting."

**Visual prompt (Slide 4 — Literature Table):**

> 16:9 slide titled "Background Study — Academic Literature". A clean 6-row 2-column table fills the lower 80% of the slide. Header row in indigo `#4F46E5` background with white text: "Author / Work" (35% width), "Key Contribution" (65% width). Body rows alternate white and very light slate `#F8FAFC` for readability. First column shows author name in bold slate followed by year in muted gray below. Second column shows the contribution in 1 short sentence. Add a tiny 16-px circular accent dot to the left of each author name colored by category: blue for "platform / community" (rows 1, 2, 3), rose for "AI / model" (rows 4, 5), amber for "OCR / legacy" (row 6). At the bottom of the slide, a one-line summary banner in light gray reading "Two threads converge: community-driven learning + multimodal AI for handwriting." No gradients.

---

## Slide 5 — Background Study (Part 2: Existing Platforms)

**On slide:**

| Platform | Approach | Limitation |
|---|---|---|
| **Docsity** | Global, freemium, AI in paid app | Typed content, paywall, no Bangladesh taxonomy |
| **Studocu** | Freemium typed documents | No handwriting focus |
| **Thinkswap** | Credit-based exchange | Must upload to download |
| **Course Hero / Chegg** | Paid subscription | Western pricing |
| **Ocenot (Bangladesh)** | Paid marketplace | Site offline, no AI features |

**Visual prompt (Slide 5 — Competitor Capability Matrix):**

> 16:9 slide titled "Existing Platforms — Capability Matrix". A capability matrix in the center with 6 rows (one per competitor + Prepify at the bottom) and 5 columns. Column headers (top row, indigo `#4F46E5` background, white text, vertically rotated 30 degrees if needed): "Free Access", "Handwriting Focus", "Community Ranking", "Multimodal AI", "Bangladesh Taxonomy". Row headers (left column, slate background, white text): "Docsity", "Studocu", "Thinkswap", "Course Hero / Chegg", "Ocenot", "Prepify". Cell contents: large red ❌ (`#DC2626`) for missing capability, large green ✅ (`#16A34A`) for present capability, amber ⚠️ (`#F59E0B`) for partial capability. Specifically: Docsity row → ❌, ❌, ⚠️, ⚠️, ❌; Studocu row → ❌, ❌, ❌, ❌, ❌; Thinkswap row → ❌, ❌, ❌, ❌, ❌; Course Hero row → ❌, ❌, ❌, ⚠️, ❌; Ocenot row → ❌, ⚠️, ❌, ❌, ✅; Prepify row → ✅, ✅, ✅, ✅, ✅ (the entire Prepify row is highlighted with a soft indigo glow background to draw the eye). At the very bottom, a one-line takeaway banner: "No existing platform fills all five columns." No gradients, flat presentation style.

---

## Slide 6 — Gap Analysis

**On slide:**

Five gaps in the current landscape:

| # | Gap | How Prepify Addresses It |
|---|---|---|
| 1 | No fully **free** access | No paywall, no credits, no premium tier |
| 2 | No **handwriting-first** platform | Upload flow + AI built around photographed pages |
| 3 | No **Bangladeshi academic taxonomy** | Faculty / Dept / Batch / Course tables modeled locally |
| 4 | AI features siloed in **paid apps** | Multimodal AI integrated into the note workflow |
| 5 | No **engagement / gamification** layer | Leaderboard, streaks, badges, public collections |

**Visual prompt (Slide 6 — Gap-to-Solution Cards):**

> 16:9 slide titled "Gap Analysis". Five horizontal "gap → solution" cards stacked vertically with 12 px gap between each. Each card spans full slide width and is divided into three regions left to right: (a) a 60-px-wide vertical strip on the far left containing a large white number (1-5) on a slate `#0F172A` background, (b) a left content half titled "GAP" with red `#DC2626` left border, light red `#FEF2F2` fill, displaying the gap statement in dark red bold text, (c) a center 48-px-wide arrow-bridge zone showing a clean rightward arrow in indigo `#4F46E5`, (d) a right content half titled "PREPIFY'S APPROACH" with green `#16A34A` left border, light green `#F0FDF4` fill, displaying the solution in dark green text. The five card pairs are:
>
> 1. GAP: No fully free access → SOLUTION: No paywall, no credits, no premium tier
> 2. GAP: No handwriting-first platform → SOLUTION: Upload flow + AI built around photographed pages
> 3. GAP: No Bangladeshi academic taxonomy → SOLUTION: Faculty / Department / Batch / Course tables modeled locally
> 4. GAP: AI siloed in paid apps → SOLUTION: Multimodal AI integrated into the note workflow
> 5. GAP: No engagement / gamification → SOLUTION: Leaderboard, streaks, badges, public collections
>
> Flat vector, no gradients. Title at top in 36-pt slate.

---

## Slide 7 — Methodology (Development Approach)

**On slide:**

- **Agile** — 1–2 week sprints over **32 weeks** (2 semesters)
- **Phase 1 (W1–16):** Auth, notes, voting, comments, follows, moderation, dashboards
- **Phase 2 (W17–32):** Bookmarks, streaks, badges, **multimodal AI pipeline**
- Single solo developer, weekly supervisor review
- Source control: Git + GitHub from day one

**Visual:** **Reuse Figure 3.5 (Agile Cycle + Phase Timeline)** from `Diagram_Generation_Prompts.md`. No new visual needed.

---

## Slide 8 — Methodology (System Architecture)

**On slide:**

- **Three-tier architecture** — browser, Next.js application, data layer
- **Frontend:** Next.js 16.1, React 19.2, Tailwind 4, shadcn/ui
- **Backend:** Next.js Server Actions (no separate API server)
- **Database:** PostgreSQL on Neon (serverless), Drizzle ORM
- **External:** Cloudinary (images), Google OAuth (auth), Brevo (email), **Gemini 2.5 Flash** (AI)
- **Hosted on:** Hostinger VPS, Ubuntu 22.04, PM2 + Nginx + Let's Encrypt

**Visual:** **Reuse Figure 3.1 (System Architecture)** from `Diagram_Generation_Prompts.md`. No new visual needed.

---

## Slide 9 — Results & Analysis (Features Delivered)

**On slide:**

22 production features across 7 modules:

| Module | Features |
|---|---|
| Auth | Google OAuth, multi-step onboarding, role gating |
| Notes | Multi-image upload, course tagging, edit, delete |
| Engagement | Likes, comments, follows, notifications (in-app + email) |
| Gamification | Leaderboard, streaks, badges, points transaction log |
| Discovery | Bookmarks, public/private collections, dept browser |
| Moderation | Pending queue, approve/reject with reason, applications |
| **AI** | **Multimodal explanations, regen cap, structured output** |

**Visual prompt (Slide 9 — Module Mosaic):**

> 16:9 slide titled "Features Delivered" with subtitle "22 features across 7 modules" in muted gray. Below the title, a 4×2 grid of "module tiles" (with the last cell of the 8-slot grid replaced by a summary count tile). Each tile is a rounded rectangle (16 px corners) with white fill and a 4-px colored top border. Inside each tile from top to bottom: a 36-px monoline icon, the module name in bold slate (24 pt), a horizontal divider line, then the comma-separated feature list in 16-pt muted slate. Color the top border of each tile by category:
>
> - **Auth** (blue `#2563EB`): "Google OAuth, multi-step onboarding, role gating"
> - **Notes** (indigo `#4F46E5`): "Multi-image upload, course tagging, edit, delete"
> - **Engagement** (amber `#F59E0B`): "Likes, comments, follows, notifications (in-app + email)"
> - **Gamification** (rose `#E11D48`): "Leaderboard, streaks, badges, points transaction log"
> - **Discovery** (emerald `#059669`): "Bookmarks, public/private collections, dept browser"
> - **Moderation** (slate `#0F172A`): "Pending queue, approve/reject with reason, applications"
> - **AI** (rose `#E11D48`, larger and emphasized with a thicker border and slight scale-up to 105%): "Multimodal explanations, regen cap, structured output"
>
> The 8th tile (bottom-right) is a "Total" summary tile in solid indigo `#4F46E5` with white text showing "22 features" as a large number with "across 7 modules" as a subtitle below. Flat vector, no gradients.

---

## Slide 10 — Results & Analysis (Performance & Testing)

**On slide:**

**Manual testing — 139 test cases across 14 areas, all passed**

| Metric | Result |
|---|---|
| Lighthouse — Landing performance | **87** |
| Lighthouse — Accessibility | **92** |
| Initial HTML delivery | ~800 ms |
| Time to interactive | ~1.5 s |
| Leaderboard query (joins users + notes + likes) | ~120 ms |
| AI first-pass success on test set | **~80%** |
| Monthly operating cost | **~$8 USD** |

**Visual prompt (Slide 10 — Performance Dashboard):**

> 16:9 slide titled "Performance & Testing Results". Layout split into two regions horizontally with 60/40 ratio. Top banner across full width (in indigo `#4F46E5` with white text, height ~80 px): "139 manual test cases, 14 test areas — all passed".
>
> **Left region (60% width) — KPI Circles:** Three large concentric ring gauges side by side, each showing a Lighthouse-style score circle. From left to right:
>
> 1. "Landing Performance" — ring filled to 87/100 in green `#16A34A`, large "87" inside, label below
> 2. "Accessibility" — ring filled to 92/100 in green `#16A34A`, large "92" inside, label below
> 3. "AI First-Pass Success" — ring filled to 80/100 in rose `#E11D48`, large "80%" inside, label below
>
> **Right region (40% width) — Speed & Cost Stats:** Vertical stack of 4 mini stat cards with white fill and slate left border:
>
> 1. Icon (lightning bolt) + "Initial HTML" / "~800 ms"
> 2. Icon (cursor) + "Time to Interactive" / "~1.5 s"
> 3. Icon (database) + "Leaderboard Query" / "~120 ms"
> 4. Icon (dollar) + "Monthly Operating Cost" / "~$8 USD" (this card highlighted with light amber `#FEF3C7` fill to make the cost stand out)
>
> Bottom one-line takeaway banner: "Production-grade performance on a student budget." Flat vector, no gradients.

---

## Slide 11 — Novelty of the Work (Overview) ⭐

**On slide:**

**Prepify occupies a four-way intersection that no other platform does:**

```
      FREE  ──────────────────  HANDWRITING-FIRST
        ╲                         ╱
         ╲      [ Prepify ]      ╱
         ╱                         ╲
   COMMUNITY-RANKED  ─────  MULTIMODAL AI EXPLANATION
```

- Each side individually exists somewhere — but **no platform combines all four**
- Plus three structural innovations layered on top:
  - **Skip-OCR multimodal pipeline** (technical novelty)
  - **Bangladesh-localized academic taxonomy**
  - **Engagement + gamification** baked into a study platform

**Speaker notes:** "I want to be careful here — note sharing is not new, voting is not new, and AI explanations are not new. What is new is the specific combination, and the engineering decisions inside the AI pipeline. Let me walk through three of those."

**Visual prompt (Slide 11 — Four-Circle Venn):**

> 16:9 slide titled "Novelty — A Four-Way Intersection". Centered four-circle Venn diagram with each circle approximately 380 px diameter, arranged as a 2×2 cluster with substantial mutual overlap. Each circle uses a translucent fill (40% opacity) with a 3-px solid outer border. Circle positions and labels:
>
> - **Top-left circle** (blue `#2563EB`): "FREE" — label inside circle near the top edge
> - **Top-right circle** (indigo `#4F46E5`): "HANDWRITING-FIRST"
> - **Bottom-left circle** (amber `#F59E0B`): "COMMUNITY-RANKED"
> - **Bottom-right circle** (rose `#E11D48`): "MULTIMODAL AI EXPLANATION"
>
> The central intersection where all four overlap is a small white-filled rounded rectangle containing the bold word "PREPIFY" in indigo `#4F46E5` (32 pt) with a small star icon ⭐ next to it. Around each non-central petal of the Venn (the regions where 1, 2, or 3 circles overlap but not all 4), place small ghosted competitor logo names in muted gray to show what currently lives in each partial intersection: "Docsity" in the (Community + AI) petal, "Studocu" in the (Handwriting + Community) petal nope they don't actually have handwriting — instead place "Notaloy" in the (Free + Bangladesh) petal, "Thinkswap" in the (Community + Free credits) petal. The point is to visually show that other platforms occupy partial intersections but only Prepify occupies the center.
>
> Below the Venn (lower 25% of slide), three small horizontal "+" badges in a row reading: "+ Skip-OCR pipeline" (rose), "+ Bangladesh taxonomy" (emerald), "+ Streaks & badges" (amber). Flat vector, generous whitespace.

---

## Slide 12 — Novelty #1: Skip-OCR Multimodal Pipeline ⭐

**On slide:**

**The conventional pipeline:**

> Image → **Tesseract OCR** → text → text-only LLM → explanation

**Prepify's pipeline:**

> Image → **Gemini 2.5 Flash directly** → structured JSON

**Why this is a meaningful innovation:**

| Traditional OCR pipeline | Prepify's direct multimodal pipeline |
|---|---|
| Loses spatial layout (which line belongs to which equation) | Preserves visual structure |
| Fails on irregular handwriting | Handles Bangla, English, mixed scripts |
| Cannot read mathematical notation reliably | Reads formulas, diagrams, sketches |
| Two failure points (OCR + LLM) | Single failure point |
| Requires separate OCR + LLM infrastructure | One API call |

**Output is structured, not free-form** — enforced via Zod schema through Vercel AI SDK's `generateObject()`

**Speaker notes:** "Most academic work — and most commercial features — still chain OCR with a text LLM. We deliberately skipped that step. A multimodal model preserves the spatial information that an explanation actually depends on."

**Visual prompt (Slide 12 — Pipeline Comparison):**

> 16:9 slide titled "Novelty #1 — Skip-OCR Multimodal Pipeline". Upper half (60% height) is a side-by-side pipeline comparison with a horizontal divider in the middle:
>
> **Top sub-row — TRADITIONAL PIPELINE** (light red `#FEF2F2` background strip with "TRADITIONAL" tag in red `#DC2626`):
>
> A horizontal flow with 5 nodes connected by right-pointing arrows:
> `[Handwritten Image]` → `[Tesseract OCR]` → `[Plain Text (lossy)]` → `[Text-only LLM]` → `[Explanation]`
>
> Each node is a rounded rectangle with white fill and red border. Add a small red ⚠️ icon and label "spatial layout lost" between OCR and Text. Add another small red ⚠️ icon and label "no math, no diagrams" near Text-only LLM.
>
> **Bottom sub-row — PREPIFY'S PIPELINE** (light green `#F0FDF4` background strip with "PREPIFY" tag in green `#16A34A`):
>
> A horizontal flow with 3 nodes connected by right-pointing arrows:
> `[Handwritten Image]` → `[Gemini 2.5 Flash (multimodal)]` → `[Structured JSON]`
>
> Each node is a rounded rectangle with white fill and green border. Add a small green ✅ icon and label "spatial structure preserved" above the middle node. Add another green ✅ icon and label "schema-enforced output" above the right node.
>
> Lower half (40% height): a 2-column comparison table titled "Why this matters":
>
> | Traditional OCR pipeline | Prepify's direct multimodal pipeline |
> |---|---|
> | Loses spatial layout | Preserves visual structure |
> | Fails on irregular handwriting | Handles Bangla, English, mixed scripts |
> | Cannot read formulas reliably | Reads formulas, diagrams, sketches |
> | Two failure points | Single failure point |
> | Requires OCR + LLM infrastructure | One API call |
>
> Left column cells in light red, right column cells in light green. Flat vector, no gradients.

---

## Slide 13 — Novelty #2: Structured AI Output Schema ⭐

**On slide:**

**The model is forced to return this exact shape — every time:**

```typescript
{
  summary: string,
  steps: [{ stepNumber, title, content }],
  keyConcepts: [{ name, description }],
  observations: string | null,
  topics: string[]
}
```

**Why structured output matters:**

- No fragile string parsing in the application code
- UI panel renders deterministically — every note looks consistent
- `topics[]` becomes the basis for **future similarity search & recommendation**
- `regenerateCount` capped at 3 → cost control + abuse prevention
- Provider-agnostic: **switching from Gemini to GPT-4 or Claude is one line in `lib/ai/provider.ts`**

**Speaker notes:** "Free-form chat output looks impressive in a demo but breaks in production. Every response from Prepify's AI conforms to a Zod schema. If the model deviates, the SDK rejects the response. That's what makes the explanation panel reliable."

**Visual prompt (Slide 13 — Schema-to-UI Mapping):**

> 16:9 slide titled "Novelty #2 — Schema-Enforced Structured Output". Two-column layout, equal width.
>
> **Left column — Code Block:** A monospace code block on a dark slate `#0F172A` background with syntax-highlighted TypeScript:
>
> ```typescript
> const explanationSchema = z.object({
>   summary: z.string(),
>   steps: z.array(z.object({
>     stepNumber: z.number(),
>     title: z.string(),
>     content: z.string(),
>   })),
>   keyConcepts: z.array(z.object({
>     name: z.string(),
>     description: z.string(),
>   })),
>   observations: z.string().nullable(),
>   topics: z.array(z.string()),
> });
> ```
>
> Use VSCode-like syntax colors: `const`/`return` in pink, type names in cyan, strings in orange, brackets in white. Add a small label above the code block: "lib/ai/schemas.ts (Zod)".
>
> **Right column — Rendered UI Panel:** A mockup of the actual AI explanation panel as it appears in the Prepify UI. Background white with rounded card border. Top: bold "Summary" label and 2 lines of placeholder text. Below: numbered step cards (3 visible) each with a "Step 1: Title" header in indigo and 2 lines of body text. Below: "Key Concepts" definition list with 2 entries. Below: a small "Observations" callout in light amber. Bottom: a row of topic chips ("Merge Sort", "Master Theorem", "Recurrence", "Time Complexity") in pill style with rose `#E11D48` borders.
>
> Connect the two columns with five thin curved arrows in light gray going from each schema field on the left to the matching UI region on the right (summary→Summary, steps→Step cards, keyConcepts→Definition list, observations→Callout, topics→Chips). Each arrow has a small label of the field name.
>
> Below the two columns, a one-line banner: "Switch from Gemini to GPT-4 or Claude in one line — `lib/ai/provider.ts`". Flat vector.

---

## Slide 14 — Novelty #3: Localized Taxonomy + Gamification ⭐

**On slide:**

**Bangladesh-first academic taxonomy:**

- 4-level hierarchy: **Faculty → Department → Batch → Course**
- Seeded with real DIU structure — extensible to any Bangladeshi university
- Cascading dropdowns in onboarding + upload form

**First note-sharing platform with engagement loops:**

| Feature | Mechanism |
|---|---|
| **Daily streaks** | Tracked atomically per `YYYY-MM-DD`, longest-streak record |
| **Achievement badges** | 4 categories: upload, streak, engagement, social |
| **Transactional leaderboard** | Every point traceable to a like / unlike event |
| **Public collections** | Bookmarks become discoverable "curated playlists" |

**Speaker notes:** "Docsity has a points system. Studocu has bookmarks. None of them combine streaks, badges, transactional auditability, and public curation. Together these turn a drop-in tool into a daily habit during exam season."

**Visual prompt (Slide 14 — Taxonomy + Gamification):**

> 16:9 slide titled "Novelty #3 — Localized Taxonomy + Gamification". Two-region horizontal split with 40/60 ratio.
>
> **Left region (40%) — Taxonomy Tree:** Vertical hierarchy diagram of the 4-level Bangladeshi academic taxonomy. Top node: a slate `#0F172A` rounded rectangle labeled "Faculty" with subtitle "FSIT, Faculty of Engineering, …". Below it, branching into 3 child nodes: emerald `#059669` boxes labeled "Department" with examples "CSE, EEE, SWE". Below them, branching into batch nodes: amber `#F59E0B` boxes labeled "Batch" with examples "55, 56, 57". Below them, leaf nodes: indigo `#4F46E5` boxes labeled "Course" with examples "CSE 313, CSE 415, MAT 102". Connect with clean orthogonal lines. Add a small "Bangladesh-first" tag at the top right of the region in red.
>
> **Right region (60%) — Gamification Mosaic:** A 2×2 grid of feature tiles, each a rounded card with white fill and a 4-px colored left border. Each card contains an icon, a title, and a one-line mechanism description.
>
> 1. Top-left tile (orange flame icon, rose `#E11D48` border): **Daily Streaks** — "Tracked atomically per YYYY-MM-DD, longest-streak record"
> 2. Top-right tile (medal icon, amber `#F59E0B` border): **Achievement Badges** — "4 categories: upload, streak, engagement, social"
> 3. Bottom-left tile (chart icon, indigo `#4F46E5` border): **Transactional Leaderboard** — "Every point traceable to a like / unlike event"
> 4. Bottom-right tile (bookmark stack icon, emerald `#059669` border): **Public Collections** — "Bookmarks become discoverable curated playlists"
>
> Below the right region, a one-line banner: "First note-sharing platform with full engagement loop." Flat vector.

---

## Slide 15 — Novelty Summary ⭐

**On slide:**

**What I claim is novel about Prepify:**

| Claim | Why it holds |
|---|---|
| **Four-way feature intersection** | No commercial or local platform overlaps all four (free, handwriting-first, community-ranked, multimodal AI) |
| **Direct multimodal pipeline** | Skips OCR — preserves spatial structure, handles Bangla + English + math |
| **Schema-enforced AI output** | Production-grade, deterministic, vendor-swappable |
| **Local taxonomy + gamification** | First note-sharing platform with streaks, badges, and transactional leaderboard |
| **Free for end users at $8/month operating cost** | Sustainable on a student developer's budget |

**The contribution is the integration as much as any single component.**

**Visual prompt (Slide 15 — Novelty Claim Cards):**

> 16:9 slide titled "Novelty Summary — Five Claims". Five vertically stacked claim cards spanning ~80% of slide width, centered. Each card is a rounded rectangle (16 px corners) divided into three regions left to right: (a) a 60-px-wide circular badge on the left holding a large white roman numeral I, II, III, IV, V on a colored fill (cycle: indigo, rose, blue, emerald, amber), (b) a wide center region with the claim title in bold slate (24 pt), (c) a right-aligned justification in muted slate (16 pt italic).
>
> Cards in order:
>
> - **I.** Four-way feature intersection — *No commercial or local platform overlaps all four (free, handwriting-first, community-ranked, multimodal AI)*
> - **II.** Direct multimodal pipeline — *Skips OCR; preserves spatial structure; handles Bangla + English + math*
> - **III.** Schema-enforced AI output — *Production-grade, deterministic, vendor-swappable*
> - **IV.** Local taxonomy + gamification — *First note-sharing platform with streaks, badges, transactional leaderboard*
> - **V.** Free at $8/month operating cost — *Sustainable on a student developer's budget*
>
> Bottom of slide: a single bold tagline in italic indigo `#4F46E5`: *"The contribution is the integration as much as any single component."* Flat vector.

---

## Slide 16 — Sample Dataset & Expected Output

**On slide:**

**Input:** Photographed handwritten solution (1–10 pages, JPEG/PNG/WebP, ≤10 MB each)

**Example input:** A 2-page handwritten solution to "Find the time complexity of merge sort using recurrence relation"

**Output (generated by Gemini 2.5 Flash):**

```json
{
  "summary": "The notes derive the time complexity of merge sort
              by solving its recurrence T(n) = 2T(n/2) + n
              using the master method, arriving at O(n log n).",
  "steps": [
    { "stepNumber": 1, "title": "Set up the recurrence",
      "content": "Express merge sort's cost as T(n) = 2T(n/2) + n..." },
    { "stepNumber": 2, "title": "Apply the master theorem",
      "content": "Identify a=2, b=2, f(n)=n. Compute log_b(a)=1..." },
    { "stepNumber": 3, "title": "Conclude the bound",
      "content": "Since f(n) = Θ(n^log_b(a)), Case 2 applies → T(n) = Θ(n log n)." }
  ],
  "keyConcepts": [
    { "name": "Master Theorem",
      "description": "Solves divide-and-conquer recurrences..." },
    { "name": "Recurrence Relation",
      "description": "Mathematical expression for recursive cost..." }
  ],
  "observations": "Page 2 contains a small arithmetic slip in line 3 — the constant cancels.",
  "topics": ["Merge Sort", "Master Theorem", "Recurrence Relations",
             "Time Complexity", "Divide and Conquer"]
}
```

**Visual prompt (Slide 16 — Input/Output Composite):**

> 16:9 slide titled "Sample Input → Structured Output". Three-column layout with 35/10/55 width ratio.
>
> **Left column (35%)** — header label "INPUT (handwritten)" in slate, then a realistic-looking mockup of a photographed handwritten notebook page with mathematical content showing the merge-sort recurrence T(n) = 2T(n/2) + n, master theorem cases, and ending with T(n) = O(n log n). The page should look like notebook paper with horizontal lines (cream/yellowish background `#FFFBEB`) and dark blue ink-style handwriting. Add a slight rotation (~2 degrees) for realism. Below the page, a small caption: "1 of 2 pages".
>
> **Center column (10%)** — large vertical arrow in indigo `#4F46E5` pointing right with the label "Gemini 2.5 Flash" running vertically along it.
>
> **Right column (55%)** — header label "OUTPUT (structured JSON)" in slate, then a rendered AI-explanation panel mockup matching the actual Prepify UI:
>
> - Top: "Summary" heading + 2 lines of summary text in light gray box
> - Middle: 3 numbered step cards stacked, each with title in indigo and 1 line of body
> - Below steps: 2 "Key Concept" definition rows (term in bold, description in regular)
> - Below: small amber-bordered observation callout
> - Bottom: row of 5 topic-tag chips in rose-bordered pill style
>
> Add a small footer below the right column: "Validated by Zod schema, written to `ai_explanation` table". Flat vector, no gradients.

---

## Slide 17 — Web Interface (Part 1)

**On slide:**

Two screenshots side by side:

- **Landing page** (light mode) — hero, stats strip, featured notes, department browser
- **Note detail page** (dark mode) — title, uploader, image gallery, comments

**Caption:** Responsive design — adapts from 375 px mobile to 1920 px desktop without horizontal scrolling.

**Visual:** **Reuse Figure 3.6 (Landing + Note Detail)** screenshot composite from your report, with a thin border around each capture and a presentation title bar above.

---

## Slide 18 — Web Interface (Part 2 — AI + Dashboards)

**On slide:**

Three screenshots:

- **AI Explanation Panel** — summary + numbered steps + key concepts + topic chips
- **Moderator Dashboard** — pending queue with approve/reject controls
- **Admin Dashboard** — platform statistics + user role management

**Visual:** **Reuse Figures 4.5 and 4.6** screenshot composites from your report. Tile them in a 2×2 grid (top: AI panel + moderator queue, bottom: admin dashboard + user management) with consistent borders and a small caption under each.

---

## Slide 19 — Conclusion

**On slide:**

**Delivered:**

- ✅ Complete platform — auth, notes, engagement, moderation, AI
- ✅ Multimodal AI pipeline with structured output and regen cap
- ✅ Localized taxonomy + gamification layer
- ✅ Production deployment at `prepify.space`
- ✅ All 6 project objectives met

**Honest limitations:**

- No automated test suite (manual testing only)
- Small active user base (not yet stress-tested)
- Image-only uploads (no PDF support yet)
- Email-only notifications (no Web Push)

**Next steps:**

- Automated quiz generation from notes (Phase III)
- Similar-note discovery via embedding the AI-generated topic tags
- PDF support, Web Push notifications, multi-institution rollout

**Visual prompt (Slide 19 — Three-Column Conclusion):**

> 16:9 slide titled "Conclusion". Three equal-width vertical columns separated by thin vertical dividers, each with a colored header strip at the top and a list of items below.
>
> **Left column** — green `#16A34A` header strip with white text "DELIVERED". Below: 5 list items each prefixed with a green ✅ checkmark in 18-pt slate text. Items:
>
> 1. Complete platform — auth, notes, engagement, moderation, AI
> 2. Multimodal AI pipeline with structured output and regen cap
> 3. Localized taxonomy + gamification layer
> 4. Production deployment at `prepify.space`
> 5. All 6 project objectives met
>
> **Center column** — amber `#F59E0B` header strip with white text "LIMITATIONS". Below: 4 list items each prefixed with a small amber ⚠️ icon in 18-pt slate text. Items:
>
> 1. No automated test suite (manual testing only)
> 2. Small active user base (not yet stress-tested)
> 3. Image-only uploads (no PDF support yet)
> 4. Email-only notifications (no Web Push)
>
> **Right column** — indigo `#4F46E5` header strip with white text "NEXT STEPS". Below: 4 list items each prefixed with a small indigo → arrow in 18-pt slate text. Items:
>
> 1. Automated quiz generation from notes (Phase III)
> 2. Similar-note discovery via topic-tag embeddings
> 3. PDF support + Web Push notifications
> 4. Multi-institution rollout
>
> Bottom of slide: a single one-line banner in muted gray italic: *"Honest about what's done, what's not, and what's next."* Flat vector, no gradients.

---

## Slide 20 — References

**On slide (cite the most important 6–8 only — full IEEE list is in the report):**

[1] M. A. Chatti et al., "Toward a Personal Learning Environment Framework," *IJVPLE*, 2010.

[2] G. Attwell, "Personal Learning Environments — the future of eLearning?," *eLearning Papers*, 2007.

[3] S. Getenet et al., "Students' digital technology attitude and online learning engagement," *IJETHE*, 2024.

[4] Google DeepMind, "Gemini: A Family of Highly Capable Multimodal Models," arXiv:2312.11805, 2023.

[5] A. Vaswani et al., "Attention Is All You Need," *NeurIPS*, 2017.

[6] R. Smith, "An overview of the Tesseract OCR engine," *ICDAR*, 2007.

[7] Vercel, "Next.js Documentation," 2026.

[8] Drizzle Team, "Drizzle ORM Documentation," 2026.

**Visual:** No new visual needed — plain reference list slide. Use a small "References" header in slate, then the 8 references in two columns (4 per column) with reference numbers in indigo.

---

## Slide 21 — Thank You / Q&A

**On slide:**

- **Thank You**
- Questions?
- Live demo available at **`prepify.space`**
- Source code: GitHub (Shorno Kamal Roy)
- Contact: [your email]

**Visual prompt (Slide 21 — Closing):**

> 16:9 closing slide. White background. Centered: large "Thank You" in indigo `#4F46E5` (96 pt). Below it: smaller "Questions?" in slate (40 pt). Further below: a clean info card (light gray fill, slate border, rounded corners) containing four lines centered:
>
> - 🌐 Live demo: **prepify.space**
> - 💻 Source: **GitHub — Shorno Kamal Roy**
> - 📧 Contact: **[your email]**
> - 🎓 Daffodil International University, Department of CSE
>
> Bottom of slide, in muted gray (16 pt): "Supervised by Md. Sazzadur Ahamed and Md. Ashraful Islam Talukder". No background images, no decorative borders, just clean professional layout.

---

# APPENDIX — Backup Slides (Keep Ready for Q&A)

These don't appear in the main flow but should be in your deck just past Slide 21, ready to jump to if asked. Each one ~30 seconds to explain.

---

## Backup A — ER Diagram

**Visual:** Reuse Figure 3.3 (ER Diagram) from `Diagram_Generation_Prompts.md`. Use for any "show me the schema" question.

---

## Backup B — `generateExplanation` Server Action Code

**On slide:** Code snippet of the actual server action with the 5 validation checks highlighted. Use for any "how do you control AI cost / abuse" question.

**Visual prompt (Backup B — Code Snippet with Highlights):**

> 16:9 slide titled "Backup — `generateExplanation` Server Action". Centered: a code block on dark slate `#0F172A` background showing this TypeScript code with VSCode-like syntax highlighting:
>
> ```typescript
> export async function generateExplanation(noteId: number) {
>   // 1. Auth check → 401
>   const session = await checkAuth();
>   if (!session?.user) return unauthorized();
>
>   // 2. Note exists + load with course, files → 404
>   const targetNote = await db.query.note.findFirst({
>     where: eq(note.id, noteId),
>     with: { course: true, files: true },
>   });
>   if (!targetNote) return notFound();
>
>   // 3. Ownership check → 403
>   if (targetNote.userId !== session.user.id) return forbidden();
>
>   // 4. Status check → 400
>   if (targetNote.status !== "approved") return badRequest();
>
>   // 5. Regen cap → 429
>   if (existing && existing.regenerateCount >= MAX_REGENERATIONS)
>     return tooManyRequests();
>
>   // → call Gemini 2.5 Flash with Zod schema
>   const aiResult = await generateNoteExplanation(
>     targetNote.files.map(f => f.url),
>     targetNote.course.name
>   );
>
>   // → persist with status='ready'
>   await db.update(aiExplanation)
>     .set({ ...aiResult, status: "ready" })
>     .where(eq(aiExplanation.id, recordId));
> }
> ```
>
> Highlight each numbered comment line (1-5) with a red left border bar in `#DC2626`. Add a small label on the right edge for each: "401", "404", "403", "400", "429" in matching red badges. Title at top: "Five validation gates protect cost and integrity." Flat code-editor aesthetic.

---

## Backup C — Lighthouse Score Breakdown

**On slide:** Detailed Lighthouse breakdown — Performance / Accessibility / Best Practices / SEO with sub-metrics.

**Visual prompt (Backup C — Lighthouse Detail):**

> 16:9 slide titled "Backup — Lighthouse Score Breakdown". Recreate the actual Lighthouse score panel layout: four large ring gauges in a row (Performance, Accessibility, Best Practices, SEO) with scores (87, 92, 95, 90 respectively) in green if ≥ 90 or amber if 80-89. Below the gauges, a 2-column "Performance Metrics" table:
>
> - First Contentful Paint: 0.8 s
> - Largest Contentful Paint: 1.5 s
> - Total Blocking Time: 60 ms
> - Cumulative Layout Shift: 0.02
> - Speed Index: 1.4 s
> - Time to Interactive: 1.5 s
>
> Below the table, a small note: "Measured on production deployment at prepify.space, mobile profile, fast 3G simulation". White background, flat vector.

---

# Presentation Flow Tips

| Aspect | Recommendation |
|---|---|
| **Total time** | 12–15 minutes presentation + 3–5 minutes Q&A |
| **Time per slide** | ~40 seconds average; spend **~2 minutes on Novelty section (slides 11–15)** |
| **Live demo** | If allowed, do a 90-second live demo right after Slide 18 — log in, upload a note, generate an AI explanation in real time |
| **Font sizing** | Title 36–44 pt, bullets 24–28 pt, never below 18 pt |
| **Visual ratio** | At least 50% of every slide should be visual (figure / table / screenshot), not text |
| **Backup slides** | Three backup slides (A, B, C) ready to jump to if asked |
| **Color rule** | Stick to the palette in the Style Preface — don't introduce new colors |
| **Animation rule** | One simple fade transition between slides; avoid spinning, zooming, or bouncing animations |

---

# Tool Recommendations

| Slide / Visual | Best tool to generate |
|---|---|
| Slide 1, 21 | PowerPoint / Google Slides directly |
| Slides 2, 3, 6, 9, 14, 19 (cards / grids) | Figma or PowerPoint with shape tools |
| Slides 4, 5 (tables) | PowerPoint table styles |
| Slides 7, 8, 17, 18 (reused figures) | Already generated for the report |
| Slide 10 (gauges + KPI) | PowerPoint with native chart, or Canva templates |
| Slide 11 (4-circle Venn) | draw.io with translucent shapes, or Figma |
| Slide 12 (pipeline comparison) | Excalidraw or PowerPoint shapes |
| Slide 13 (code + UI mapping) | Carbon (https://carbon.now.sh) for the code block, then composite in Figma with the UI mockup |
| Slide 15 (claim cards) | PowerPoint shape stack |
| Slide 16 (input/output composite) | Take a real photo of handwritten notes for the left side, screenshot the AI panel for the right side, composite in Figma |
| Backup B (code) | Carbon (https://carbon.now.sh) with the "Slate" theme |

For all AI image generators (ChatGPT, Gemini, Whimsical), prepend the **Common Visual Style Preface** at the top of this document to every prompt for consistency.
