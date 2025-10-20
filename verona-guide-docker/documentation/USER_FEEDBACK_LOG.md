# USER_FEEDBACK_LOG

Chronological log of product owner inputs and feedback. See 00_PROJECT_STANDARDS.md for format and rules.

---

Date: 2025-10-14
Topic: MVP scope & data model
Summary: Validate core hypothesis via simple rule-based itineraries and curated content.
Details:
- Start with curated set of 20–30 destinations (alternatives to mass-tourism)
- Questionnaire drives selection (duration, interests, mobility, traveler type, budget, crowd sensitivity)
- Include weather as the single external dynamic input in MVP
Decisions:
- Implement rule-based matching first; no complex AI for itinerary generation
- Store destinations and quiz as structured content (will be in Strapi)
Actions:
- Define content types and quiz model in CMS

---

Date: 2025-10-14
Topic: Hybrid hosting & CMS automation
Summary: Split FE on SiteGround and BE on Synology; use n8n for scheduled updates.
Details:
- Headless CMS (Strapi) self-hosted; APIs consumable by FE and n8n
- n8n runs scheduled workflows for data refresh (weather, affluence)
- FE Next.js runs on SiteGround; BE on Synology via reverse proxy + HTTPS
Decisions:
- Adopt hybrid architecture FE (SiteGround) + BE (NAS)
- Use Postgres for Strapi; Docker for all BE services
Actions:
- Add docker-compose with services: backend, db, frontend, n8n

---

Date: 2025-10-14
Topic: Sustainability strategy (tokens, CPU/RAM)
Summary: Limit LLM/API calls and balance real-time with scheduled storage.
Details:
- Batch/schedule external data (weather, affluence) 2–3 times/day
- Cache in CMS and serve precomputed data to users; avoid per-visitor API calls
- Use LLM only to generate narrative reasoning after deterministic matching
- Chatbot served from SiteGround API Route (off NAS)
Decisions:
- Document sustainability principles in Architecture doc
Actions:
- Added section 2.5 in 02_ARCHITECTURE.md (Good-Enough Real-Time, targeted AI, chatbot offloading)

---

Date: 2025-10-14
Topic: Affluence data providers
Summary: Google Places lacks Popular Times in API; consider scraping services and location intelligence.
Details:
- Outscraper, SerpAPI, BestTime.app for Popular Times-like data (MVP)
- Placer.ai, Foursquare, Unacast, SafeGraph, Echo Analytics, Veraset for advanced/paid future
Decisions:
- MVP: Outscraper or BestTime.app; update 2–3/day via n8n
Actions:
- Plan n8n workflow calling chosen provider; store results in Strapi fields

---

Date: 2025-10-15
Topic: Branding & payoff
Summary: Identity is narrative, modular, local-explorer focused.
Details:
- Payoff change: "Skip the crowd, find YOUR treasure"
- Visual: warm, symbolic, modular branding (icons/gliphs), inspired by Porto/Bologna cases
- Reasoning animation after quiz showing triggers (sun, crowd, shade, etc.)
Decisions:
- Adopt payoff and narrative UX; document in 01_PROJECT_VISION.md
Actions:
- Vision doc updated with palette, typography, and reasoning animation concept

---

Date: 2025-10-15
Topic: NAS capabilities & placement
Summary: DS220+ (2 cores, 2GB RAM) is OK for MVP; recommend 6GB upgrade.
Details:
- Strapi + Postgres + n8n feasible; upgrade improves responsiveness at scale
Decisions:
- Proceed with DS220+; monitor and plan RAM upgrade
Actions:
- None

---

Date: 2025-10-15
Topic: Sources for events/content
Summary: Prefer non-institutional/local sources; track CSV file of sources.
Details:
- Reference file path: `verona.guide/verona.guide/fonti verona_guide.csv`
Decisions:
- Use manual curation for MVP; automate later via n8n scraping where viable
Actions:
- Map CSV fields to Strapi content types

---

Date: 2025-10-16
Topic: Documentation standards
Summary: Persist all inputs and decisions in Markdown; enable LLM continuity.
Details:
- Create standards file and a running feedback log
Decisions:
- Add 00_PROJECT_STANDARDS.md and USER_FEEDBACK_LOG.md
Actions:
- Files created and committed
