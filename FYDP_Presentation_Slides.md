# FYDP Phase-I Presentation
## Prepify – A Community Driven Platform for Handwritten Notes

---

## SLIDE 1: Title Slide

**Prepify**
*A Community Driven Platform for Handwritten Notes*

- **Presented by:** Shorno Kamal Roy (222-15-6141)
- **Supervisor:** Md. Sazzadur Ahamed, Assistant Professor
- **Co-Supervisor:** Md. Ashraful Islam Talukder, Lecturer
- **Department:** Computer Science and Engineering, DIU
- **Date:** January 2026

---

## SLIDE 2: Outline

➤ Introduction
➤ Background Study / Literature Review
➤ Gap Analysis
➤ Objective and Motivation
➤ Novelty of this Study
➤ Datasets, Tools and Techniques
➤ Proposed Methodology
➤ Expected Outcomes
➤ Q & A

---

## SLIDE 3: Introduction

### What is Prepify?

- A **web-based collaborative platform** for university students
- Share, organize, and **rank handwritten academic solutions**
- Addresses challenges of accessing quality study materials

### The Problem

- Quality notes shared via **Messenger/WhatsApp groups**
- Notes are **unorganized and easily lost**
- No way to identify **most helpful content**
- Existing platforms are **paid or overwhelming**

---

## SLIDE 4: Background Study / Literature Review

### Existing Platforms Analysis

| Platform | Features | Limitations |
|----------|----------|-------------|
| **Docsity** | Global notes, ratings, categories | Overwhelming content, premium locks |
| **Thinkswap** | Credit-based exchange | Paid access, limited handwritten notes |
| **Ocenot** | Bangladesh marketplace | Commercial focus, no ranking/AI |

### Key Finding

> **No platform offers free, community-ranked handwritten notes with AI features**

---

## SLIDE 5: Gap Analysis

| Gap | Current Platforms | Prepify Solution |
|-----|-------------------|------------------|
| **No Collaborative Upload** | Paid/credit-restricted (Docsity, Thinkswap) | Free, open upload for all students |
| **Unorganized Resources** | Massive volumes, hard to navigate | Structured by university/course/topic |
| **No Quality Ranking** | Basic ratings, not optimized for notes | Voting + Contributor Leaderboard |
| **No AI for Handwritten Notes** | AI exists but not for handwritten content | OCR, summarization for handwritten notes |

---

## SLIDE 6: Objective and Motivation

### Motivation

- 📚 Improve **access to quality study materials**
- 🎯 Help students **find best solutions quickly**
- 🤝 Build **knowledge sharing community**

### Three Objectives

1. **Develop collaborative web platform** for uploading, organizing, and sharing handwritten academic notes

2. **Implement community engagement features** including voting, ranking, and contributor leaderboard

3. **Prepare AI integration framework** for OCR, summarization, and quiz generation

---

## SLIDE 7: Novelty of this Study

### What Makes Prepify Unique?

While platforms like **Docsity** and **Thinkswap** offer general study materials with some AI capabilities, they primarily focus on typed documents and operate on paid or credit-based models. **Ocenot** serves Bangladesh but functions as a commercial marketplace without community ranking or AI features.

**Prepify** addresses these limitations by being the **first platform specifically designed for handwritten academic problem-solving notes**. Our unique approach combines:

1. **Free, unlimited access** – No paywalls or credit systems
2. **Handwritten content focus** – Optimized for problem-solving notes, not general documents
3. **Community-driven quality ranking** – Voting system and contributor leaderboard
4. **AI tailored for handwritten content** – OCR and summarization designed for handwritten notes (Phase-II)
5. **Bangladesh university integration** – Structured by local departments and courses

---

## SLIDE 8: Datasets, Tools and Techniques

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19.2, Next.js 16.1, TypeScript |
| **Backend** | Node.js, Next.js Server Actions |
| **Database** | PostgreSQL, Drizzle ORM |
| **Auth** | Better Auth (Google OAuth) |
| **Storage** | Cloudinary |
| **Email** | Brevo API |

### Phase-II AI Technologies

- OCR: Tesseract.js / Google Cloud Vision
- LLM: OpenAI GPT / Google Gemini

---

## SLIDE 9: Proposed Methodology

### Development Approach

```
Requirements → Design → Development → Testing → Deployment
     ↑                                              |
     └──────────── Iteration (Agile) ──────────────┘
```

### Architecture

| Component | Technology |
|-----------|------------|
| Frontend | Next.js App Router (SSR) |
| Backend | Next.js Server Actions |
| Database | PostgreSQL + Drizzle ORM |
| Storage | Cloudinary CDN |
| Hosting | Hostinger VPS |

---

## SLIDE 10: Proposed Methodology (cont.)

### Database Schema

Core tables: Users, Notes, Courses, Departments, Likes, Comments, Follows, Notifications, Leaderboard

### Data Collection

| Category | Method |
|----------|--------|
| User Info | Google OAuth + Onboarding |
| Note Content | User upload forms |
| Engagement | Platform tracking |
| Moderation | Moderator actions |

---

## SLIDE 11: Expected Outcomes

### Project Usefulness

**For Students:**
- 📚 **Easy access** to quality handwritten solutions in one organized place
- ⏱️ **Save time** finding relevant notes instead of searching chat groups
- 🏆 **Identify best content** through community voting and rankings
- 🤝 **Learn from peers** through shared problem-solving approaches

**For Academic Community:**
- 📈 **Knowledge preservation** – notes no longer lost in chat histories
- 🎓 **Peer learning culture** – encourages collaborative knowledge sharing
- ✅ **Quality assurance** – moderation ensures reliable content

---

## SLIDE 12: Expected Outcomes (cont.)

### Project Impact

| Stakeholder | Benefit |
|-------------|---------|
| **Students** | Better exam preparation with ranked, quality notes |
| **Contributors** | Recognition through leaderboard and points |
| **Universities** | Organized academic resource repository |

### Phase-II Enhancement

With AI integration, students will be able to:
- **Search handwritten content** via OCR text extraction
- **Get instant summaries** of lengthy notes
- **Self-assess** with auto-generated quizzes

---

## SLIDE 13: Financial Analysis

### Project Cost

| Item | Monthly Cost |
|------|--------------|
| Neon PostgreSQL | Free |
| Cloudinary | Free |
| Brevo Email | Free |
| VPS Hosting | 10,000 BDT/year |
| Domain | 1,000 BDT/year |
| **Total** | **11,000 BDT/year** |

*Primarily using free tiers of cloud services*

---

## SLIDE 14: Summary

### Key Achievements

✅ Fully functional web platform
✅ Community features (voting, follow, comments)
✅ Moderation system ensuring quality
✅ Modern tech stack (Next.js, PostgreSQL)

### Phase-II Focus

🔜 OCR for searchable handwritten content
🔜 AI summaries and quiz generation
🔜 PDF/document processing

---

## SLIDE 15: Q & A

# Thank You!

**Questions?**

---

**Live Demo:** prepify.space
**GitHub:** github.com/Shorno/prepify

---

## References

1. Chatti et al., "Personal Learning Environment Framework," IJVPLE, 2010
2. Attwell, "Personal Learning Environments," eLearning Papers, 2007
3. Getenet et al., "Digital technology and online learning," IJETHE, 2024
4. Ocenot.com, Docsity.com, Thinkswap.com
5. Google DeepMind, "Gemini," arXiv, 2023
6. Smith, "Tesseract OCR Engine," ICDAR, 2007
