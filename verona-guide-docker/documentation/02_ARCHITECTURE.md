# 2. Architettura del Sistema

Questo documento descrive l'architettura ibrida scelta per il progetto, ottimizzata per performance, costi e controllo.

## 2.1. Panoramica

L'ecosistema Verona.Guide è composto da quattro servizi containerizzati che comunicano attraverso una rete Docker condivisa:

- **Frontend**: applicazione Next.js che espone l'interfaccia pubblica.
- **Backend**: headless CMS Strapi per la modellazione dei contenuti e la gestione del backoffice editoriale.
- **Database**: PostgreSQL che persiste contenuti e configurazioni del CMS.
- **Automazione**: n8n per orchestrare workflow di import, arricchimento e notifiche.

Questa architettura a micro-servizi leggeri consente di sviluppare, testare e distribuire ogni componente in modo indipendente pur garantendo un comportamento coordinato.

## 2.2. Componenti Principali

### Strapi (Backend headless)
- **Ruolo**: definisce i content type (es. destinazioni, itinerari, eventi) e fornisce API REST/GraphQL consumate dal frontend e dai workflow.
- **Perché serve**: separa la redazione dei contenuti dal codice, offre un pannello admin per il team, centralizza le autorizzazioni.
- **Connessioni**: legge e scrive su PostgreSQL, espone API alla rete interna e riceve chiamate dai workflow di n8n.

### PostgreSQL
- **Ruolo**: salva contenuti, metadati e configurazioni generate da Strapi.
- **Perché serve**: garantisce consistenza alle query del CMS e supporta tipi JSON utili per campi dinamici.
- **Connessioni**: accessibile solo dalla rete Docker ai servizi autorizzati; non è esposto all'esterno.

### Next.js
- **Ruolo**: genera le pagine web (SSR/SSG), gestisce routing e interazione utente, si integra con Strapi tramite fetch alle API.
- **Perché serve**: abilita un'interfaccia dinamica, SEO-friendly e facilmente distribuibile (Node o statico in CDN).
- **Connessioni**: in locale chiama le API di Strapi tramite `http://backend:1337`; in produzione userà l'endpoint pubblico protetto.

### n8n
- **Ruolo**: automatizza import/export dati, sincronizzazioni con servizi terzi e notifiche interne (es. aggiornare affluenza, meteo).
- **Perché serve**: permette al team non tecnico di modellare processi complessi con un editor visuale mantenendo il controllo in-house.
- **Connessioni**: chiama API esterne e quelle Strapi; può leggere/scrivere file montati in volumi condivisi.

## 2.3. Flussi Principali

### Richiesta di contenuti
1. L'utente visita il portale Next.js.
2. Il frontend chiama le API di Strapi (`/api/...`) per recuperare contenuti e configurazioni.
3. Strapi elabora la richiesta, interroga PostgreSQL e restituisce JSON al frontend.
4. Next.js renderizza l'interfaccia sfruttando i dati e li mostra all'utente.

### Automazioni
1. Un workflow n8n parte manualmente o tramite trigger schedulato/webhook.
2. Il workflow recupera dati da fonti esterne (es. meteo, dataset CSV).
3. n8n normalizza le informazioni e chiama le API protette di Strapi per aggiornare i contenuti.
4. Strapi salva i cambiamenti nel database e rende disponibili i nuovi dati al frontend.

## 2.4. Distribuzione e Sicurezza

- **Ambiente locale**: tutti i servizi girano tramite Docker Compose condividendo reti e volumi nominati; l'accesso avviene tramite `localhost`.
- **Produzione prevista**: il backend (Strapi + PostgreSQL + n8n) può vivere su infrastruttura self-hosted o cloud (es. NAS/Synology, VPS, VM) dietro reverse proxy HTTPS; il frontend Next.js può essere distribuito come app Node o come build statica su CDN.
- **Hardening**: usare certificati TLS, secret management via variabili d'ambiente, backup periodici dei volumi `strapi-data` e `n8n-data`, e firewall che espongono solo le porte necessarie.

## 2.5. Politica di Sincronizzazione Dati

- Ogni content type Strapi che necessita di aggiornamenti periodici (es. `Destination`) espone i campi `last_synced` (datetime) e `sync_frequency` (enum: daily/weekly/biweekly/monthly/quarterly). n8n legge questi valori per alimentare le code di refresh, assicurando che i job girino solo quando necessario.
- Workflow consigliato:
  - **Creazione o modifica**: il record viene marcato con `last_synced = now()` e `sync_frequency` scelto dal redattore (default: weekly). Eventuali enrichment con Gemini+Maps avvengono in modo sincrono o tramite job ad alta priorità.
  - **Batch scheduler**: ogni notte n8n seleziona i record con `last_synced` oltre la soglia definita dalla frequenza e li mette in coda per aggiornamenti (es. orari, descrizioni, punteggi affluenza). Un hard cap di token/API call impedisce sforamenti di budget.
  - **Stato e audit**: i job scrivono il nuovo timestamp e loggano consumi (token, API) per analisi costi. Se il refresh fallisce, `last_synced` resta invariato e il record viene ripianificato.
- Dati time-sensitive (meteo, affluenza) vivono in tabelle dedicate con TTL: vengono aggiornati con cron leggere (ogni 6-12 ore) e serviti dal DB alle istanze utente senza chiamate live.

## 2.6. Tassonomia delle Destinazioni & Strategie di Diversificazione

- **Categorie principali** (allineate al questionario e ai dataset CSV):
  1. *Alta Cucina & Fine Dining* – menu degustazione, ticket medio alto, esperienza gourmet.
  2. *Tradizione & Osterie* – cucina tipica veronese, atmosfera informale, forte legame locale.
  3. *Casual/Fusion & Contemporanee* – format moderni, creativi, contaminazioni internazionali.
  4. *Street Food & Fast Informal* – opzioni rapide, budget friendly, ideale per itinerari brevi.
  5. *Caffè, Bar & After Dinner* – degustazioni, mixology, luoghi per after-hours.
  6. *Esperienze Speciali* – location scenografiche, hidden gems, locali con storytelling forte.
  7. *Family Friendly & Inclusive* – servizi per bambini, accessibilità, menu dedicati.

- **Strategie di selezione**:
  - Ogni itinerario propone 1 opzione principale + 2 alternative: *coerente con il profilo*, *budget differente*, *esperienza diversa ma vicina* (es. stessa zona o categoria complementare).
  - Priorità ai POI non mainstream: i dataset CSV forniscono “fonti” e tag per identificare località emergenti; i job n8n assegnano punteggi di priorità usando segnali come `affluenza = bassa` o presenza di note “gioiello nascosto”.
  - Le categorie sono usate per bilanciare il mix cittadino: in ogni batch di refresh importiamo una quota per categoria (es. 40% tradizione, 30% casual/fusion, 15% speciali, ecc.) per evitare bias.
  - Durante il matching con il questionario, il motore filtra per categoria/interesse e ritmo, quindi applica ranking per: distanza, affluenza compatibile, budget coerente, novità (last_synced più recente).
- **Gestione metadati**: Strapi memorizza tags (es. `slow-tourism`, `romantico`, `vegetariano`), punteggi crowd, best time, e li riutilizza per generare consigli senza nuove chiamate LLM.
