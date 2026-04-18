# Prepify — Competitive Analysis & Unique Feature Recommendations

## Current Prepify Feature Inventory

Based on the codebase analysis, Prepify currently has:

| Feature | Status |
|---------|--------|
| Google OAuth + onboarding (department/batch/faculty) | ✅ |
| Multi-image note upload with Cloudinary | ✅ |
| Note categorization by Course → Department → Faculty | ✅ |
| Like/vote system | ✅ |
| Points-based leaderboard (with transactions) | ✅ |
| Comments on notes | ✅ |
| Follow system between users | ✅ |
| Notification system (new note, new follower, etc.) | ✅ |
| Moderation workflow (pending/approved/rejected) | ✅ |
| Admin & Moderator dashboards | ✅ |
| Moderator applications | ✅ |
| User profiles with public pages | ✅ |
| Resource/reference link attachments on notes | ✅ |
| Dark/light theme toggle | ✅ |
| Email notifications (Brevo) | ✅ |
| View count tracking | ✅ |
| PDF file support | ✅ |
| Featured notes on homepage | ✅ |
| Department browsing with note counts | ✅ |
| Platform stats dashboard | ✅ |

---

## Competitor Feature Matrix

| Feature | Prepify | Docsity | Studocu | Thinkswap | Course Hero | Chegg | Notaloy |
|---------|---------|---------|---------|-----------|-------------|-------|---------|
| Free unlimited access | ✅ | ❌ (freemium) | ❌ (freemium) | ❌ (credits) | ❌ (paid) | ❌ (paid) | ✅ |
| Handwritten notes focus | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Community voting/ranking | ✅ | ⚠️ (basic) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Contributor leaderboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bangladesh university focus | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| AI summaries | 🔜 Phase-II | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| OCR search | 🔜 Phase-II | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AI quiz generation | 🔜 Phase-II | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Flashcards | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Spaced repetition | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Study groups | ❌ | ⚠️ (forums) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bookmarks/collections | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Note version history | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exam countdown/calendar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Collaborative annotation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Study streaks/badges | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🏆 Recommended Unique Features

Organized by implementation effort — start with Quick Wins to immediately differentiate, then build toward the high-impact features.

---

### 🟢 QUICK WINS (1–3 days each)

---

#### 1. 📌 Bookmark & Personal Collections

> **Why it's unique for Prepify:** No competitor combines bookmarks with community-ranked handwritten notes. Students can curate their own "exam prep folders" from community-voted best content.

**What it does:**
- Students can bookmark/save individual notes
- Create named collections (e.g., "CSE 303 Final Prep", "Data Structures Essentials")
- Private collections by default, with option to share publicly
- Shared collections become discoverable — creating a "curated playlist" effect for study material

**Implementation sketch:**
- New `bookmark` table: `userId`, `noteId`, `collectionId?`, `createdAt`
- New `collection` table: `userId`, `name`, `description`, `isPublic`, `createdAt`
- UI: Bookmark icon on note cards + "My Collections" page under profile
- Bonus: "Most Saved" badge on popular notes → social proof

**Uniqueness score:** ⭐⭐⭐ (Studocu has basic bookmarks, but no public curated collections tied to a leaderboard system)

---

#### 2. 🔥 Study Streaks & Achievement Badges

> **Why it's unique:** NO competitor platform has study engagement gamification for note-sharing. Docsity has points, but no streaks or badges. This turns Prepify from a "drop-in, drop-out" tool into a daily habit.

**What it does:**
- **Daily streak:** Track consecutive days a user uploads, likes, or comments
- **Badges:** Earned for milestones:
  - "First Upload" 📝, "10 Notes" 🔟, "100 Likes Received" ❤️‍🔥
  - "7-Day Streak" 🔥, "30-Day Streak" ⚡, "Department Champion" 🏆
  - "Helpful Commenter" (10+ comments), "Resource Linker" (5+ reference links)
- Badges displayed on profile and next to username on notes
- Weekly "Streak Leaderboard" alongside existing points leaderboard

**Implementation sketch:**
- New `user_streak` table: `userId`, `currentStreak`, `longestStreak`, `lastActiveDate`
- New `badge` table + `user_badge` junction table
- Server action that updates streak on any qualifying activity
- Badge display component for profiles and note cards

**Uniqueness score:** ⭐⭐⭐⭐⭐ (Zero competitors have this for academic note-sharing)

---

#### 3. 📊 "Note Quality Score" — Transparent Note Rating

> **Why it's unique:** Competitors use simple likes or star ratings. Prepify can create a **composite quality score** that considers multiple factors, making it a truly data-driven ranking.

**What it does:**
- Each note gets a visible quality score (0-100) computed from:
  - Likes-to-views ratio (engagement quality, not just raw count)
  - Number of unique commenters
  - Number of saves/bookmarks
  - Uploader's reputation (leaderboard rank influences score slightly)
  - Freshness decay (newer notes get a slight boost)
- Score displayed as a badge/meter on note cards
- Notes sorted by quality score by default in course listings

**Implementation sketch:**
- Computed field or materialized score in the `note` table
- Cron job or trigger-based recalculation
- Visual component: circular progress indicator or letter grade (A+, A, B+, etc.)

**Uniqueness score:** ⭐⭐⭐⭐ (Reddit-style algorithms applied specifically to academic handwritten notes — novel in this space)

---

### 🟡 MEDIUM EFFORT (1–2 weeks each)

---

#### 4. 📅 Exam Countdown & Course Timeline

> **Why it's unique:** NO academic note platform ties notes directly to exam schedules. This makes Prepify the only platform that says "Your CSE 303 exam is in 5 days — here are the top-rated notes."

**What it does:**
- Students (or course moderators) can set exam dates for each course
- Dashboard widget: "Upcoming Exams" with countdown timers
- Contextual note suggestions: "Trending notes for CSE 303 this week" (spikes before exams)
- Notification: "Your CSE 303 exam is in 3 days — 5 new notes were uploaded this week"
- Visual timeline showing note upload activity over course duration

**Implementation sketch:**
- New `exam_schedule` table: `courseId`, `examType` (midterm/final/quiz), `examDate`, `createdBy`
- Dashboard component with countdown cards
- Modified notification logic to send exam reminders
- Algorithm: boost notes for courses with upcoming exams in homepage feed

**Uniqueness score:** ⭐⭐⭐⭐⭐ (Completely unique — no competitor does this)

---

#### 5. 🤝 Study Groups (Course-Based)

> **Why it's unique:** Docsity has forums, but no competitor has private/public study groups tied to specific courses where students can share notes, discuss problems, and prep together.

**What it does:**
- Students can create/join study groups linked to a course
- Private group chat/discussion board
- Shared note collections within groups
- Group activity feed: "Rashed just uploaded a new note for CSE 303"
- Before-exam "study sessions" — a focused discussion thread tied to exam countdown

**Implementation sketch:**
- New `study_group` table: `id`, `courseId`, `name`, `description`, `isPublic`, `createdBy`
- New `study_group_member` table: `groupId`, `userId`, `role` (admin/member)
- New `group_message` table for discussion
- UI: Groups page under each course, sidebar in course detail view

**Uniqueness score:** ⭐⭐⭐⭐ (WhatsApp/Messenger groups are the current "solution" — Prepify replaces that chaos with structure)

---

#### 6. ✍️ Collaborative Note Annotation

> **Why it's unique:** NO study platform allows collaborative annotation specifically on handwritten note images. This turns passive viewing into active, community-driven learning.

**What it does:**
- On the note detail page, students can add pinned comments at specific locations on the note image
- Click a spot on the handwritten note → add a clarifying comment, correction, or question
- "Is this formula correct?" markers visible as small pins on the image
- Note author can accept/reject corrections
- Community can upvote helpful annotations → quality control

**Implementation sketch:**
- New `annotation` table: `noteId`, `fileId`, `userId`, `x`, `y`, `content`, `createdAt`, `isResolved`
- Canvas overlay on note images (using HTML canvas or absolute-positioned markers)
- Pin icon components with expandable comment threads

**Uniqueness score:** ⭐⭐⭐⭐⭐ (This is genuinely novel — Google Docs has comments, but NO platform does this for handwritten note images)

---

#### 7. 📱 "Quick Capture" — Mobile Note Scanner

> **Why it's unique:** Docsity has OCR but requires manual upload. Prepify can offer a mobile-optimized "scan and upload" flow that makes sharing handwritten notes as easy as taking a phone photo.

**What it does:**
- Mobile-optimized camera capture page
- Auto-crop and enhance handwritten note photos (contrast, rotation, perspective correction)
- Quick tagging: select course from recent courses, add title
- Upload in under 10 seconds from phone
- Auto-suggest course based on user's department and recent uploads

**Implementation sketch:**
- New `/capture` route with mobile camera access (MediaDevices API)
- Client-side image processing (canvas-based crop/enhance)
- Simplified upload form pre-filled with user's department info
- PWA-style "Add to Home Screen" prompt for mobile users

**Uniqueness score:** ⭐⭐⭐⭐ (Docsity has a mobile app, but Prepify's web-based scanner = no app install needed)

---

### 🔴 HIGH IMPACT (Phase-II Level, 2–4 weeks)

---

#### 8. 🧠 AI "Explain This" — Contextual AI for Handwritten Content

> **Why it's unique:** While Docsity, Studocu, and Chegg all have AI features, NONE are specifically designed for handwritten problem-solving notes. This is Prepify's biggest differentiator.

**What it does:**
- "Explain This" button on any note
- AI reads the handwritten content (via OCR) and provides:
  - Step-by-step explanation of the solution approach
  - Identifies which formulas/theorems were used
  - Highlights potential errors or alternative approaches
  - "Is this correct?" verification with confidence score
- Works in English and Bangla

**Implementation sketch:**
- OCR pipeline: Tesseract.js → Google Cloud Vision fallback
- LLM prompt engineering: "Given this handwritten solution for [course], explain..."
- Caching: store AI responses per note to avoid repeated API calls
- UI: expandable AI explanation panel below note images

**Uniqueness score:** ⭐⭐⭐⭐⭐ (THE killer feature — no competitor does AI specifically for handwritten academic solutions)

---

#### 9. 🎯 Smart Note Recommendations — "Students Like You Also Found Helpful"

> **Why it's unique:** Course Hero and Chegg have basic "related content," but no platform uses collaborative filtering based on voting/engagement patterns for handwritten notes.

**What it does:**
- "Recommended for you" section based on:
  - Notes liked by users who liked the same notes you did (collaborative filtering)
  - Popular notes in your department/courses
  - Notes trending in courses you follow
  - Notes from contributors you follow
- "Similar Notes" section on each note detail page

**Implementation sketch:**
- Collaborative filtering: query users who liked the same notes → find their other liked notes
- Simple algorithm: no ML needed, just SQL queries on the existing `note_like` table
- New `recommended notes` component on the home page
- "Students in [department] also liked..." sidebar

**Uniqueness score:** ⭐⭐⭐ (The approach isn't novel, but applying it to handwritten notes with community ranking data is)

---

#### 10. 📝 AI-Generated Practice Questions from Notes

> **Why it's unique:** Chegg and Studocu generate quizzes from typed PDFs. Prepify would be the FIRST to generate practice questions from handwritten notes specifically.

**What it does:**
- "Practice" button on any approved note
- AI extracts key concepts from handwritten content
- Generates 5-10 multiple-choice or short-answer questions
- Instant self-assessment with explanations
- Track scores over time: "You've improved 15% on Data Structures this month"
- Community can vote on best questions → crowdsourced question bank per course

**Implementation sketch:**
- OCR + LLM pipeline (shared with "Explain This" feature)
- New `quiz` table: `noteId`, `questions` (JSON), `createdAt`
- New `quiz_attempt` table: `userId`, `quizId`, `score`, `answers` (JSON)
- UI: quiz modal/page with progress tracking

**Uniqueness score:** ⭐⭐⭐⭐⭐ (From handwritten notes specifically — completely unique)

---

#### 11. 🏫 Department Comparison & Analytics Dashboard

> **Why it's unique:** No competitor provides department-level analytics. Useful for the university context and creates healthy academic competition.

**What it does:**
- Public dashboard showing:
  - Most active departments (by uploads, engagement)
  - Top contributors per department
  - Most popular courses (by note volume and quality)
  - Monthly trends: "CSE uploaded 45 notes this month (+23%)"
- Semester-over-semester comparison
- "Department of the Month" recognition

**Implementation sketch:**
- Aggregation queries on existing data (no new tables needed initially)
- Dashboard page with charts (Recharts or Chart.js)
- Department ranking component on homepage

**Uniqueness score:** ⭐⭐⭐⭐ (Unique to university-focused platforms — creates inter-department motivation)

---

#### 12. 🔗 "Note Chains" — Linked Note Series

> **Why it's unique:** No competitor allows students to create sequential, linked note series. Essential for multi-part problem solutions or chapter-by-chapter notes.

**What it does:**
- When uploading, option to "Continue from previous note" → link notes in a series
- Series displayed as a navigable chain: "Part 1 → Part 2 → Part 3"
- Series gets its own landing page, aggregated stats
- Students can follow a series to get notified of new parts
- "Complete Series" badge for contributors who complete multi-part uploads

**Implementation sketch:**
- New `note_series` table: `id`, `title`, `userId`, `courseId`
- Add `seriesId` + `seriesOrder` fields to `note` table
- Series detail page with sequential navigation
- "Next in series" button on note detail page

**Uniqueness score:** ⭐⭐⭐⭐⭐ (Completely novel — no platform chains notes like this)

---

## 🎯 My Top 5 Recommendations (Priority Order)

These features would make Prepify genuinely stand out and are ordered by **impact-to-effort ratio**:

| Priority | Feature | Effort | Impact | Why |
|----------|---------|--------|--------|-----|
| **1** | 📌 Bookmark & Collections | 1-2 days | High | Table-stakes feature that's missing. Users NEED this. |
| **2** | 🔥 Study Streaks & Badges | 2-3 days | Very High | Zero competitors have this. Creates daily engagement habit. |
| **3** | 📅 Exam Countdown & Timeline | 1 week | Very High | Completely unique. Turns Prepify into an exam prep command center. |
| **4** | ✍️ Collaborative Annotation | 1-2 weeks | Game-changing | THE differentiator for handwritten notes. Nobody does this. |
| **5** | 🔗 Note Chains | 3-4 days | High | Simple to build, highly useful for multi-part solutions. |

> [!TIP]
> Features 1-3 can be built entirely within your current tech stack (Next.js + PostgreSQL + Drizzle) with no external dependencies. They don't need AI and can ship immediately.

> [!IMPORTANT]
> Features 6 (Collaborative Annotation) and 8 (AI Explain This) are the most **defensible differentiators** — they're specifically designed for handwritten notes and no competitor does them. These should be the Phase-II headline features.
