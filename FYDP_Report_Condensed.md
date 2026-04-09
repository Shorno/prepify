# DAFFODIL INTERNATIONAL UNIVERSITY
## DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
## FYDP (PHASE-I) EVALUATION REPORT
### REPORTING PERIOD - FALL 2025

---

## Project Identification

| Field | Details |
|-------|---------|
| **I. Project Title** | Prepify – A Community Driven Platform for Handwritten Notes |
| **II. Group Members** | Shorno Kamal Roy (Student ID: 222-15-6141) |
| **III. Supervisor** | Md. Sazzadur Ahamed, Assistant Professor |
| **IV. Co-Supervisor** | Md. Ashraful Islam Talukder, Lecturer |
| **V. Submission Date** | _________________ |

---

## VI. Certificate

> "This is to certify that the final year design project work until Phase-I evaluation held on ___________________, titled as stated in Sec. I, executed by the students' group mentioned in Sec. II, have been found satisfactory and every section of this report is reflecting the same."

*(Signature of Supervisor & date)*

---

## Project Insights

### Thematic Area(s):

- ☒ Artificial Intelligence and Machine Learning
- ☒ Software Engineering and Development
- ☒ Natural Language Processing (NLP)
- ☒ Cloud Computing
- ☒ Image Processing

### Software Packages, Tools, and Programming Languages

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19.2, Next.js 16.1, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Next.js Server Actions, PostgreSQL, Drizzle ORM |
| **Auth & Storage** | Better Auth (Google OAuth), Cloudinary |
| **State & Forms** | Zustand, TanStack Query, React Hook Form |
| **AI/ML (Phase-II)** | OpenAI/Gemini API, Tesseract.js, pdf.js |

---

## CO Description for FYDP-Phase-I

| CO | Description | PO |
|----|-------------|----|
| CO4 | Perform economic evaluation and project management for "Prepify" | PO11 |
| CO6 | Apply appropriate methodologies and IT tools for complex engineering processes | PO5 |
| CO7 | Assess societal, safety, and legal issues in professional practice | PO6 |
| CO10 | Operate effectively as individual and team member | PO9 |

---

## 1. Project Overview

### 1.1 Introduction

Prepify is a web-based platform enabling university students to share, organize, and rank handwritten academic solutions. It addresses challenges of accessing quality study materials currently scattered across informal messaging channels.

**Main Goals:**
1. **Centralized Note Sharing** – Unified platform for handwritten solutions
2. **Community-Driven Ranking** – Voting system to identify best content
3. **AI-Powered Learning (Phase-II)** – Automated summarization and quiz generation

### 1.2 Background Study

**Key Findings:**
- Existing platforms (Chegg, Quizlet) focus on typed content, not handwritten notes
- No platform combines note sharing with community ranking AND AI content understanding
- Bangladesh students rely heavily on handwritten notes shared via informal messaging groups
- Modern OCR and LLM technologies can extract and process handwritten content

**Research Gap:** No dedicated platform for handwritten academic notes with AI-powered features.

### 1.3 Gap Analysis

| Gap | Current Situation | Proposed Solution |
|-----|-------------------|-------------------|
| Unorganized Sharing | Notes scattered in messaging groups | Structured organization by department/course |
| No Quality Ranking | No mechanism to identify helpful notes | Voting system with leaderboard |
| No AI Assistance | Manual reading required | AI summarization and quiz generation |

---

## 2. Objectives

### Objective 1: Design and Implement Core Platform
- Develop responsive web application using Next.js and React
- Implement secure Google OAuth authentication
- Design PostgreSQL database for notes, users, and interactions
- Build file upload with Cloudinary integration

### Objective 2: Build Community Engagement System
- Implement voting/like functionality with leaderboard ranking
- Create commenting and follow/notification systems
- Develop moderation workflow (pending/approved/rejected)
- Build admin and moderator dashboards

### Objective 3: Prepare AI Integration Framework (Phase-II)
- Design architecture for OCR integration (Tesseract.js/Google Vision)
- Plan LLM API integration for summarization and quiz generation
- Create modular AI service layer for future implementation

---

## 3. Methodology / Requirement Specification

### 3.1 Development Approach

**Methodology:** Agile Development with iterative prototyping

![Development Approach Diagram](C:/Users/Shorno/WebstormProjects/prepify/development_approach_diagram.png)

**Architecture:**
- **Frontend:** Next.js App Router with server-side rendering
- **Backend:** Serverless via Next.js Server Actions
- **Database:** PostgreSQL with Drizzle ORM
- **Storage:** Cloudinary CDN

### 3.2 Data Requirements

| Category | Description | Method |
|----------|-------------|--------|
| User Info | Name, email, department, batch | Google OAuth + Onboarding |
| Note Content | Title, images, course | User upload |
| Engagement | Likes, comments, views | Platform tracking |

### 3.3 Database Schema

Core tables implemented: Users, Notes, Courses, Departments, Likes, Comments, Follows, Notifications, Leaderboard

---

## 4. Progress Achieved

### 4.1 Completed Tasks

| Feature | Status |
|---------|--------|
| Project Setup (Next.js, TypeScript, Tailwind) | ✅ Complete |
| Database Design & PostgreSQL Setup | ✅ Complete |
| Google OAuth Authentication | ✅ Complete |
| Notes Upload with Cloudinary | ✅ Complete |
| Voting System & Leaderboard | ✅ Complete |
| Comments & Follow System | ✅ Complete |
| Moderation Workflow | ✅ Complete |
| Admin & Moderator Dashboards | ✅ Complete |
| Responsive Design & Dark Mode | ✅ Complete |
| Email Notifications | ✅ Complete |

### 4.2 Results

**Functional Prototype Delivered:**
- Google OAuth login with user onboarding
- Multi-image note upload with categorization
- Like/vote system with points-based leaderboard
- Content moderation with approval workflow
- Follow system with notifications

---

## 5. Challenges Faced

| Challenge | Strategy |
|-----------|----------|
| Multi-file upload complexity | Cloudinary SDK with chunked uploads |
| Real-time vote updates | TanStack Query optimistic updates |
| Complex database relations | Drizzle ORM with cascade configurations |
| Auth state management | Better Auth session management |

---

## 6. Next Steps

| Task | Timeline |
|------|----------|
| OCR Integration (Handwriting Recognition) | 02-26 |
| AI Content Summarization | 02-26 |
| Automated Quiz Generation | 03-26 |
| PDF/Document Processing | 03-26 |

---

## 7. Updated Timeline

| Tasks | Week 6-7 | Week 13-14 | Week 15-16 | Week 17-18 | Week 19-20 |
|-------|----------|------------|------------|------------|------------|
| Setup & Auth | 🟩 | | | | |
| Database & Notes | | 🟩 | | | |
| Voting & Interactions | | | 🟩 | | |
| Moderation System | | | | 🟩 | |
| Final Polish | | | | | 🟩 |

---

## 8. Resources Utilized

- **Hardware:** Development PC (16GB RAM), Mobile devices for testing
- **Software:** WebStorm, Chrome DevTools, Drizzle Studio, Figma
- **Cloud Services:** Neon (PostgreSQL), Cloudinary, Hostinger VPS, Brevo Email

---

## 9. Financial Analysis

| Item | Cost |
|------|------|
| Neon PostgreSQL | $0 (Free tier) |
| Cloudinary | $0 (Free tier) |
| VPS Hosting | $6.99/month |
| Domain (prepify.space) | $5/year |
| **Total** | ~$8/month |

---

## 10. Future Considerations

1. **Scalability:** Redis caching, CDN optimization
2. **AI Costs:** Rate limiting, response caching
3. **OCR Accuracy:** Fallback for Bengali handwriting
4. **Multi-University Support:** Institution verification process

---

## 11. Conclusion

Phase-I of Prepify has been successfully completed with a fully functional web platform for sharing and ranking handwritten academic solutions.

**Key Achievements:**
- Full-stack implementation with modern technologies
- Core features: upload, voting, leaderboard, moderation
- Responsive design with dark/light mode
- Community features: follow, comments, notifications

**Phase-II Focus:** AI-powered features including OCR, summarization, and quiz generation.

---

## References

**Educational Technology:**
1. M. A. Chatti et al., "Toward a Personal Learning Environment Framework," IJVPLE, 2010.
2. G. Attwell, "Personal Learning Environments - the future of eLearning?," eLearning Papers, 2007.
3. S. Getenet et al., "Students' digital technology attitude and online learning engagement," IJETHE, 2024.

**Technology Stack:**
4. Next.js Documentation, Vercel, 2025.
5. Drizzle ORM Documentation, 2025.
6. Better Auth Documentation, 2025.

**AI/ML:**
7. Google DeepMind, "Gemini: Multimodal Models," arXiv, 2023.
8. R. Smith, "Overview of Tesseract OCR Engine," ICDAR, 2007.

---

## Appendix

### Database Schema Diagram

![Database Schema Diagram](C:/Users/Shorno/WebstormProjects/prepify/database_schema_diagram.png)

---

*FYDP Committee, Dept. of CSE, DIU*
*Template approved by: Dr. Sheak Rashed Haider Noori, Professor and Head*
