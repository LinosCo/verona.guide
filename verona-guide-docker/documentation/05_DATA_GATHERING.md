# 5. Piano Data Gathering Destinazioni (Batch Pilota)

## 5.1. Obiettivi
- Costruire un set di 50–100 destinazioni diversificate (food, cultura, hidden gems) da usare per test di generazione itinerari.
- Massimizzare la copertura di categorie non mainstream usando le fonti CSV già raccolte come input primario.
- Minimizzare costi token/API seguendo la filosofia di sincronizzazione: enrichment solo quando necessario, caching dei risultati.

## 5.2. Priorità & Selezione iniziale
1. **Seed dalle fonti interne**: utilizzare i file `Verona.guide - ristoranti_bar_osterie.xlsx` / CSV associati per estrarre un primo elenco con campi chiave (nome, indirizzo, categoria, note hidden gem).
2. **Tagging categoria**: applicare la tassonomia descritta in `02_ARCHITECTURE.md` §2.6; strumenti:
   - matching per parole chiave (es. “osteria”, “degustazione”, “family”).
   - assegnare flag `hidden_gem` se nel CSV compaiono note come "fuori dai circuiti" o `AFFLUENZA = bassa`.
3. **Quota per batch** (target 60 schede):
   - 20 tradizione/osterie
   - 15 casual/fusion contemporanee
   - 10 esperienze speciali/hidden gems
   - 5 street food/fast informal
   - 5 bar/after dinner
   - 5 family/inclusive
   - 5 alta cucina
4. **Lista di controllo**: escludere duplicati, verificare presenza indirizzo; se mancano coordinate saranno recuperate via Gemini Maps nel passo successivo.

## 5.3. Workflow n8n per arricchimento
1. **Trigger manuale/batch**: eseguire il workflow "Destinations Enrichment" passando CSV filtrato (max 20 record per run per gestire quote).
2. **Lookup Strapi**: per ogni voce, controllare se esiste già `slug`. Se sì, saltare o aggiornare se `sync_frequency` lo consente.
3. **Gemini API (Grounding Maps)**:
   - Prompt template: "Return structured data for <NAME + ADDRESS>, including place_id, categories, opening hours, highlights, accessibility, price level, reviews summary.".
   - Abilitare Maps tool e limitare max output tokens; loggare `prompt`, `token_usage`.
   - Salvare il `context_token` per widget.
4. **Post-processing**:
   - Mappare i valori ottenuti sui campi Strapi (same schema usato per le import demo).
   - Applicare normalizzazioni (budget → low/medium/high, food_style mapping, best_time).
   - Scrivere su Strapi tramite API admin: create se nuovo, update se esistente. Aggiornare `last_synced = now()` e `sync_frequency` (default weekly; hidden gems = monthly).
5. **Persistenza output**: archiviare in S3/Drive un JSON per ogni batch con dati grezzi + trasformati (serve per audit e re-run senza nuove chiamate).

## 5.4. Verifica qualità & curazione manuale
- **Step editoriale**: il redattore controlla 10% delle schede (casuale per categoria). Se incongruenze >5%, ripetere il batch dopo correzioni al prompt.
- **Foto/media**: per evitare uso eccessivo di API, preferire link fonte originale e caricare media manualmente in Strapi solo per le destinazioni top.
- **Accessibilità & family**: verificare le note restituite (es. presenza seggioloni) confrontando con fonti ufficiali o recensioni.

## 5.5. Iterazioni future
- Una volta convalidato il batch pilota, schedulare job n8n giornalieri che prendono 5 destinazioni con `last_synced` scaduto per mantenere il dataset fresco.
- Integrare eventuali nuove fonti (es. `fonti verona.guide-2.xlsx`) con lo stesso processo, sempre passando da un filtraggio manuale iniziale per privilegiare mete meno battute.
- Prevedere un meccanismo di feedback: le destinazioni con bassa soddisfazione utente vengono messe in priorità per revisione o sostituite.
