# 4. Guida all'Avvio dell'Ambiente di Sviluppo Locale

Questo documento fornisce le istruzioni per configurare ed eseguire l'intero progetto in locale utilizzando Docker.

## 4.1. Prerequisiti

- **Docker Desktop** (o Docker Engine + Compose) in esecuzione.  
- **Git** per ottenere il repository.  
- **Node 18+** opzionale: serve solo se vuoi eseguire test o build fuori dai container.

## 4.2. Prima configurazione

1. Clona il repository e spostati nella root del progetto:
   ```bash
   git clone <URL_REPO>
   cd verona.guide/verona-guide-docker
   ```
2. Copia il file `.env.example` in `.env` (se non esiste già) e imposta:
   - credenziali del database (`DATABASE_*`);
   - segreti Strapi (`JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `APP_KEYS`);
   - eventuali chiavi aggiuntive (transfer/encryption) se abilitate.
   Per sviluppo puoi generare stringhe casuali con `openssl rand -base64 32`.
3. Non è necessario creare manualmente i progetti: il codice di Strapi e Next.js è già incluso nella repo e le immagini Docker eseguono automaticamente `npm install` sul primo avvio.

## 4.3. Avviare e fermare lo stack

Tutti i comandi vanno eseguiti dalla cartella `verona-guide-docker`.

- **Avvio completo (detached):**
  ```bash
  docker compose up -d --build
  ```
  Usa `--build` la prima volta o quando modifichi `Dockerfile` e dipendenze. Il primo start di Strapi può richiedere qualche minuto per installare i pacchetti nel volume.

- **Avviare un servizio specifico (es. solo backend):**
  ```bash
  docker compose up backend
  ```

- **Log in streaming di un servizio (es. Strapi):**
  ```bash
  docker compose logs -f backend
  ```

- **Spegnere lo stack senza perdere dati:**
  ```bash
  docker compose stop
  ```

- **Rimuovere container e rete (mantiene i volumi):**
  ```bash
  docker compose down
  ```

I volumi nominati (`strapi-data`, `n8n-data`, `verona-guide-backend-node-modules`) conservano rispettivamente il database, i workflow n8n e i pacchetti Node di Strapi.

## 4.4. Accesso ai servizi

| Servizio  | URL locale                | Note                                                                 |
|-----------|---------------------------|----------------------------------------------------------------------|
| Frontend  | `http://localhost:3000`   | Next.js in modalità sviluppo (`npm run dev` dentro il container).    |
| Strapi UI | `http://localhost:1337/admin` | Al primo accesso crea l'utente amministratore.                      |
| Strapi API| `http://localhost:1337/api/...` | Richiede token pubblico o autenticazione secondo i permessi.      |
| n8n       | `http://localhost:5678`   | Secure cookie disattivato in locale; imposta utente/password al primo login. |
| PostgreSQL| `localhost:5432`          | Usa un client SQL (DBeaver, TablePlus) con le credenziali del `.env`.|

## 4.5. Operazioni ricorrenti

- **Aggiornare dipendenze Strapi**: entra nel container (`docker compose exec backend sh`), lancia `npm install` o `npm update`, poi esegui rebuild (`docker compose up --build backend`).
- **Backup**: copia periodicamente i volumi `strapi-data` e `n8n-data` (es. con `docker run --rm -v <volume>:/data -v $(pwd):/backup alpine tar czf /backup/volume.tar.gz /data`).
- **Reset ambiente**: se vuoi ripulire tutto, esegui `docker compose down -v` (attenzione: cancella i dati nei volumi).
