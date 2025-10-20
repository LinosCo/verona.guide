# 3. Stack Tecnologico

Questo documento elenca e motiva le scelte tecnologiche per ogni componente dell'architettura.

## 3.1. Sviluppo Locale
- **Tecnologie chiave:** Docker, Docker Compose.
- **Motivazioni:**
  - **Coerenza:** lo stesso stack gira in locale, su un NAS o su un VPS con minime differenze di configurazione.
  - **Isolamento:** ogni servizio (frontend, backend, database, n8n) ha dipendenze separate e non interferisce con gli altri.
  - **Portabilità:** onboarding rapido per nuovi contributor; è sufficiente avere Docker installato.

## 3.2. Frontend
- **Framework:** Next.js (React).
- **Styling:** Tailwind CSS.
- **Linguaggio:** TypeScript.
- **Deployment previsto:** build `standalone` Node o esportazione statica su hosting/CDN (es. Vercel, SiteGround o simili).
- **Motivazioni:**
  - Rendering ibrido (SSR/SSG) per conciliare SEO e personalizzazione.
  - Tooling maturo su React con routing file-based e supporto API Routes per feature collaterali.
  - Tailwind permette UI coerenti senza boilerplate CSS.
  - TypeScript aumenta la robustezza durante lo sviluppo del prodotto.

## 3.3. Backend (Content Management)
- **Tecnologia:** Strapi 5 (Headless CMS).
- **Linguaggi:** JavaScript/TypeScript lato estensioni; Node 18 come runtime.
- **Deployment:** container Docker sia in locale sia in produzione (NAS, VPS o hosting cloud).
- **Motivazioni:**
  - Interfaccia editoriale completa per modellare contenuti, ruoli, permessi.
  - API REST e GraphQL generate automaticamente e personalizzabili via estensioni.
  - Self-hosted, nessun lock-in con SaaS di terze parti.
  - Ecosistema ricco di plugin e integrazioni, inclusi webhook per n8n.

## 3.4. Database
- **Tecnologia:** PostgreSQL 14.
- **Deployment:** container Docker con volume persistente (`strapi-data`).
- **Motivazioni:**
  - Affidabilità enterprise, supporto JSONB, estensioni mature.
  - Stack ufficialmente supportato da Strapi per ambienti production-ready.

## 3.5. Automazione
- **Tecnologia:** n8n.
- **Deployment:** container Docker con volume dedicato (`n8n-data`).
- **Motivazioni:**
  - Editor a nodi per costruire workflow comprensibili anche da profili non tecnici.
  - Controllo on-premises e costi prevedibili.
  - Ampia libreria di integrazioni (HTTP, webhook, Google, OpenWeather, OpenAI, ecc.).

## 3.6. API Esterne (roadmap)
- **Affluenza:** Outscraper Google Maps API o BestTime per i "popular times".
- **Meteo:** OpenWeatherMap.
- **Generazione storytelling:** OpenAI (GPT-4o) o modelli equivalenti.
- **Motivazioni:** combinare dati oggettivi (affluenza, meteo) e storytelling generativo per suggerimenti personalizzati.

## 3.7. Strategia LLM & sincronizzazione
- **Gemini + Grounding Maps/Search:** usato solo per tre attività ad alto valore: (1) arricchimento iniziale delle schede con dati verificati, (2) refresh batch secondo `sync_frequency`, (3) generazione in tempo reale del racconto itinerario (usando contenuti già presenti). Ogni chiamata viene loggata con consumo token.
- **Altri modelli SaaS (GPT‑4o mini, Claude Haiku, ecc.):** riservati a editing linguistico o classificazione batch quando non servono dati geospaziali; esecuzione tramite job n8n pianificati per tenere sotto controllo i costi.
- **Regole deterministic + DB first:** ranking e matching avvengono con algoritmi basati su dati salvati (preferenze questionario, punteggi Strapi). L’LLM interviene solo per personalizzare copy o colmare gap narrativi.
- **Caching & pianificazione:** i job n8n usano `last_synced` per decidere quando chiamare le API; i dataset meteo/affluenza vengono aggiornati poche volte al giorno e serviti dalle tabelle interne. Questo approccio riduce le chiamate live durante la sessione dell’utente.
