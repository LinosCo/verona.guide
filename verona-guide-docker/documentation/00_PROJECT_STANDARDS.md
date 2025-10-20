# 0. Project Standards and Operating Rules

Purpose: ensure every instruction, feedback, and decision from the product owner is preserved in Markdown so all future sessions (humans and LLMs) can reliably pick up context and continue consistently.

Last updated: 2025-10-16

## 0.1. Source of Truth (documentation set)
The documentation folder is the single source of truth for strategy and technical decisions:
- 00_PROJECT_STANDARDS.md (this file)
- 01_PROJECT_VISION.md (branding, payoff, UX narrative)
- 02_ARCHITECTURE.md (infra, flows, security, sustainability principles)
- 03_TECHNOLOGY_STACK.md (tools, APIs, vendors, tradeoffs)
- 04_DEVELOPMENT_SETUP.md (local env, commands, URLs)
- USER_FEEDBACK_LOG.md (chronological log of inputs/feedback from the owner)

## 0.2. Feedback preservation rule (mandatory)
- Every owner input, clarification, or constraint must be appended to USER_FEEDBACK_LOG.md on the same day it is received.
- If an input changes a prior decision, update the relevant document section (Vision/Architecture/Stack) and add a short "Decision Changed" note with the date.
- Never delete prior content. Deprecate with a note instead (Reason, Date, New Decision).

## 0.3. Entry format (for USER_FEEDBACK_LOG.md)
Use this template per entry:
- Date: YYYY-MM-DD
- Topic: short tag (e.g., Branding, Affluence, Hosting)
- Summary: one sentence
- Details: bullet list of points from the owner
- Decisions: bullet list of resulting decisions (link to docs updated)
- Actions: what was/will be done next

## 0.4. PR/Commit checklist
Before closing a task, ensure:
- USER_FEEDBACK_LOG.md updated if owner input influenced the task
- Related docs updated (01/02/03/04) and cross-linked
- Docker or code changes include minimal comments linking to docs section
- Secrets are never committed; use .env and Secret Managers

## 0.5. LLM collaboration rules
- Always read documentation/*.md before proposing changes
- Prefer appending to docs over rewriting large sections
- When adding a new concept, create a small section and link it from the index of the relevant doc
- Echo the exact file paths when referencing workspace files

## 0.6. Sustainability-first operating principles
- Minimize API and LLM token usage (batching, scheduled fetch, cache)
- Balance real-time with scheduled storage (Good-Enough Real-Time)
- Offload chatbot to SiteGround API Route; keep NAS for CMS + automations

## 0.7. File locations and conventions
- n8n exports: `verona-guide-docker/n8n/exports/*.json`
- API keys: `.env` (never commit real secrets). Use placeholders with CLEAR comments.
- Brand assets: `branding/` (to be added) with moodboard JPG/PNG and SVG icons
- Content models definitions (Strapi): document fields in `documentation/02_ARCHITECTURE.md` and keep model JSON exports in `backend/app` repo if needed

## 0.8. Session procedure (for devs/LLMs)
1) Read USER_FEEDBACK_LOG.md latest entries
2) Read affected docs sections
3) Execute task
4) Update docs + log
5) Summarize changes in commit message: `docs: update (topic)` or `feat/fix/chore: ...` with link to doc section

## 0.9. Templates
- Feedback entry: see 0.3
- Decision note: `[Decision Changed | YYYY-MM-DD] Old -> New (link)`

This standard is mandatory for all contributors.