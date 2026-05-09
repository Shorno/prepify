# Prepify — Final Defense Presentation

**Project:** Prepify — A Community Driven Platform for Handwritten Academic Notes
**Student:** Shorno Kamal Roy (222-15-6141)
**Supervisor:** Md. Sazzadur Ahamed, Assistant Professor
**Co-Supervisor:** Md. Ashraful Islam Talukder, Lecturer
**Department:** CSE, Daffodil International University
**Date:** May 2026

**Total slides:** 17 (12–15 minutes presentation + 3–5 minutes Q&A)
**Focus area:** Novelty of the Work (Slide 11)

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

---

## Slide 3 — Objectives

**On slide:**

**1. Build the core platform.**
A free, structured space for uploading and discovering handwritten notes — organized by Faculty, Department, and Course, with role-based moderation.

**2. Build the engagement layer.**
Likes, comments, follows, leaderboard, streaks, badges, and curated collections — the social loop that surfaces quality.

**3. Integrate multimodal AI.**
Gemini 2.5 Flash reads handwritten images directly and returns structured explanations — no OCR step.

**Speaker notes:** "Three objectives, one for each layer of the system — the platform, the engagement loop on top of it, and the AI pipeline that sets it apart."

---

## Slide 4 — Background Study (Part 1: Academic Literature)

**On slide:**


| Author                 | Title                                                     | Objectives                                             | Methodology                                                | Key Findings                                                                           |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Chatti et al. (2010)   | The Future of E-Learning                                  | Define the Personal Learning Environment (PLE) concept | Conceptual framework + literature synthesis                | Learners benefit from personalised, networked spaces over rigid institutional systems  |
| Attwell (2007)         | Personal Learning Environments — the future of eLearning? | Position PLE as the next stage of eLearning            | Position paper with case observations                      | Learner control + trusted communities raise engagement and resource quality            |
| Getenet et al. (2024)  | Students' Digital Attitude & Online Learning Engagement   | Measure how digital habits affect engagement           | Quantitative survey of university students                 | Engagement is highest when a platform fits students' existing habits                   |
| Vaswani et al. (2017)  | Attention Is All You Need                                 | Replace recurrence with pure self-attention            | Novel architecture + WMT benchmark experiments             | Transformer architecture — the basis of every modern multimodal LLM                    |
| Google DeepMind (2023) | Gemini: A Family of Multimodal Models                     | Build natively multimodal foundation models            | Large-scale joint training on text / image / audio / video | One model reads images (incl. handwriting & Bangla) and produces text in a single pass |
| Smith (2007)           | An Overview of the Tesseract OCR Engine                   | Document Tesseract's architecture and capabilities     | Engine description + recognition benchmarks                | Strong on printed text; struggles on irregular handwriting                             |


**Speaker notes:** "The literature splits into two threads. The top three rows are about *how* students learn best — personalised, community-driven, habit-aligned. The bottom three are about *what* technology can finally do — multimodal LLMs read handwriting directly, which is something Tesseract-style OCR was never reliable at. Prepify sits at the intersection of those two threads."

---

## Slide 5 — Background Study (Part 2: Existing Platforms)

**On slide:**


| Platform                | Approach                         | Limitation                                     |
| ----------------------- | -------------------------------- | ---------------------------------------------- |
| **Docsity**             | Global, freemium, AI in paid app | Typed content, paywall, no Bangladesh taxonomy |
| **Studocu**             | Freemium typed documents         | No handwriting focus                           |
| **Thinkswap**           | Credit-based exchange            | Must upload to download                        |
| **Course Hero / Chegg** | Paid subscription                | Western pricing                                |
| **Ocenot (Bangladesh)** | Paid marketplace                 | Site offline, no AI features                   |


---

## Slide 6 — Gap Analysis

**On slide:**

Five gaps in the current landscape:


| #   | Gap                                    | How Prepify Addresses It                               |
| --- | -------------------------------------- | ------------------------------------------------------ |
| 1   | No fully **free** access               | No paywall, no credits, no premium tier                |
| 2   | No **handwriting-first** platform      | Upload flow + AI built around photographed pages       |
| 3   | No **Bangladeshi academic taxonomy**   | Faculty / Dept / Batch / Course tables modeled locally |
| 4   | AI features siloed in **paid apps**    | Multimodal AI integrated into the note workflow        |
| 5   | No **engagement / gamification** layer | Leaderboard, streaks, badges, public collections       |


---

## Slide 7 — Methodology (Development Approach)

**On slide:**

- **Agile** — 1–2 week sprints over **32 weeks** (2 semesters)
- **Phase 1 (W1–16):** Auth, notes, voting, comments, follows, moderation, dashboards
- **Phase 2 (W17–32):** Bookmarks, streaks, badges, **multimodal AI pipeline**
- Single solo developer, weekly supervisor review
- Source control: Git + GitHub from day one

**Visual:** Reuse the Agile / phase timeline figure from your **Final Report** (Chapter 3), or rebuild the same layout in your slide deck.

---

## Slide 8 — Methodology (System Architecture)

**On slide:**

- **Three-tier architecture** — browser, Next.js application, data layer
- **Frontend:** Next.js 16.1, React 19.2, Tailwind 4, shadcn/ui
- **Backend:** Next.js Server Actions (no separate API server)
- **Database:** PostgreSQL on Neon (serverless), Drizzle ORM
- **External:** Cloudinary (images), Google OAuth (auth), Brevo (email), **Gemini 2.5 Flash** (AI)
- **Hosted on:** Hostinger VPS, Ubuntu 22.04, PM2 + Nginx + Let's Encrypt

**Visual:** Reuse the system architecture figure from your **Final Report** (Chapter 3), or export the same diagram from your report figures folder.

---

## Slide 9 — Results & Analysis (Features Delivered)

**On slide:**

22 production features across 7 modules:


| Module       | Features                                                  |
| ------------ | --------------------------------------------------------- |
| Auth         | Google OAuth, multi-step onboarding, role gating          |
| Notes        | Multi-image upload, course tagging, edit, delete          |
| Engagement   | Likes, comments, follows, notifications (in-app + email)  |
| Gamification | Leaderboard, streaks, badges, points transaction log      |
| Discovery    | Bookmarks, public/private collections, dept browser       |
| Moderation   | Pending queue, approve/reject with reason, applications   |
| **AI**       | **Multimodal explanations, regen cap, structured output** |


---

## Slide 10 — Results & Analysis (Performance & Testing)

**On slide:**

**Manual testing — 139 test cases across 14 areas, all passed**


| Metric                                          | Result      |
| ----------------------------------------------- | ----------- |
| Lighthouse — Landing performance                | **87**      |
| Lighthouse — Accessibility                      | **92**      |
| Initial HTML delivery                           | ~800 ms     |
| Time to interactive                             | ~1.5 s      |
| Leaderboard query (joins users + notes + likes) | ~120 ms     |
| AI first-pass success on test set               | **~80%**    |
| Monthly operating cost                          | **~$8 USD** |


---

## Slide 11 — Novelty of the Work ⭐

**On slide:**

**What makes Prepify different — five user-facing differentiators:**

| # | Differentiator | What it means for the student |
|---|---|---|
| 1 | **Built for Bangladesh** | Faculty → Department → Batch → Course taxonomy + Bangla handwriting |
| 2 | **Handwriting-first** | Snap a notebook page — no typing, no scanning, no PDFs |
| 3 | **Free, no credits** | No paywall, no upload-to-download exchange, no subscription |
| 4 | **AI explains your photo** | Reads diagrams, equations, mixed scripts — not just text |
| 5 | **A daily exam-prep habit** | Streaks, badges, leaderboard, and curated collections |

**Other platforms cover one or two of these. Prepify is the first to combine all five.**

**Speaker notes:** "Note sharing isn't new. Voting isn't new. AI explanations aren't new. What's new is the *combination* — and the fact that it's built around how Bangladeshi students actually study: photos of notebooks, shared in groups, organized by batch and course. Each of these five pieces individually exists somewhere; no platform offers all five together, and certainly not for free."

---

## Slide 12 — Sample Dataset & Expected Output

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

---

## Slide 13 — Web Interface (Part 1)

**On slide:**

Two screenshots side by side:

- **Landing page** (light mode) — hero, stats strip, featured notes, department browser
- **Note detail page** (dark mode) — title, uploader, image gallery, comments

**Caption:** Responsive design — adapts from 375 px mobile to 1920 px desktop without horizontal scrolling.

**Visual:** **Reuse Figure 3.6 (Landing + Note Detail)** screenshot composite from your report, with a thin border around each capture and a presentation title bar above.

---

## Slide 14 — Web Interface (Part 2 — AI + Dashboards)

**On slide:**

Three screenshots:

- **AI Explanation Panel** — summary + numbered steps + key concepts + topic chips
- **Moderator Dashboard** — pending queue with approve/reject controls
- **Admin Dashboard** — platform statistics + user role management

**Visual:** **Reuse Figures 4.5 and 4.6** screenshot composites from your report. Tile them in a 2×2 grid (top: AI panel + moderator queue, bottom: admin dashboard + user management) with consistent borders and a small caption under each.

---

## Slide 15 — Conclusion

**On slide:**

**Delivered:**

- ✅ Complete platform — auth, notes, engagement, moderation, AI
- ✅ Multimodal AI pipeline with structured output and regen cap
- ✅ Localized taxonomy + gamification layer
- ✅ Production deployment at `prepify.space`
- ✅ All 3 project objectives met

**Honest limitations:**

- No automated test suite (manual testing only)
- Small active user base (not yet stress-tested)
- Image-only uploads (no PDF support yet)
- Email-only notifications (no Web Push)

**Next steps:**

- Automated quiz generation from notes (Phase III)
- Similar-note discovery via embedding the AI-generated topic tags
- PDF support, Web Push notifications, multi-institution rollout

---

## Slide 16 — References

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

## Slide 17 — Thank You / Q&A

**On slide:**

- **Thank You**
- Questions?
- Live demo available at `**prepify.space`**
- Source code: GitHub (Shorno Kamal Roy)
- Contact: [your email]

---

# APPENDIX — Backup Slides (Keep Ready for Q&A)

These don't appear in the main flow but should be in your deck just past Slide 17, ready to jump to if asked. Each one ~30 seconds to explain.

---

## Backup A — ER Diagram

**Visual:** Reuse the ER diagram from your **Final Report** (Chapter 3). Use for any "show me the schema" question.

---

## Backup B — `generateExplanation` Server Action Code

**On slide:** Five validation gates before the model is called (map each to the HTTP status the action returns):

1. **401** — Not signed in (`checkAuth`).
2. **404** — Note id not found.
3. **403** — Caller is not the note owner.
4. **400** — Note not approved yet, or note has no image files.
5. **429** — Regeneration count ≥ 3 (`MAX_REGENERATIONS`).

**Reference:** Full implementation in `actions/ai/generate-explanation.ts` — paste a shortened excerpt into the slide if your panel wants code on-screen.

---

## Backup C — Lighthouse Score Breakdown

**On slide:** Detailed Lighthouse breakdown — Performance / Accessibility / Best Practices / SEO with sub-metrics.

---

# Presentation Flow Tips


| Aspect             | Recommendation                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Total time**     | 12–15 minutes presentation + 3–5 minutes Q&A                                                                               |
| **Time per slide** | ~45 seconds average; spend **~2 minutes on Novelty (Slide 11)** since it is the differentiator slide                       |
| **Live demo**      | If allowed, do a 90-second live demo right after Slide 14 — log in, upload a note, generate an AI explanation in real time |
| **Font sizing**    | Title 36–44 pt, bullets 24–28 pt, never below 18 pt                                                                        |
| **Visual ratio**   | At least 50% of every slide should be visual (figure / table / screenshot), not text                                       |
| **Backup slides**  | Three backup slides (A, B, C) ready to jump to if asked                                                                    |
| **Color rule**     | Keep a consistent slide palette (slate, indigo, blue, amber, rose); avoid random extra colors                          |
| **Animation rule** | One simple fade transition between slides; avoid spinning, zooming, or bouncing animations                                 |


---
