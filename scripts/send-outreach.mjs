#!/usr/bin/env node
// Merchant outreach email sender via Resend API
// Usage: RESEND_API_KEY=re_xxx FROM_EMAIL=info@verona.guide node send-outreach.mjs

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "info@verona.guide";
const FROM_NAME = process.env.FROM_NAME || "Team verona.guide";
const PHONE = process.env.PHONE || "045 5864932";
const SITE = "https://www.verona.guide";
const BT_INTERVIEW_LINK =
  process.env.BT_INTERVIEW_LINK ||
  process.env.BT_INTERVIEW_IT_URL ||
  process.env.BT_BUSINESS_LINK ||
  "https://businesstuner.voler.ai/i/intervista-esercenti-verona-73b7eb";

if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY env var");
  process.exit(1);
}

const recipients = [
  {
    to: "hello@crispylab.design",
    name: "Crispy Lab",
    slug: "crispy-lab",
    greeting: "Buongiorno,",
    hook: "Il vostro lavoro su artigianato digitale e produzione locale è esattamente il tipo di eccellenza che vogliamo valorizzare.",
  },
  {
    to: "info@ettogrammo.it",
    name: "Ettogrammo",
    slug: "ettogrammo",
    greeting: "Ciao,",
    hook: "Il vostro approccio su cibo sfuso e filiera consapevole rappresenta perfettamente la Verona autentica che raccontiamo.",
  },
  {
    to: "birrificio.campostela@gmail.com",
    name: "Birrificio Campostela",
    slug: "birrificio-campostela",
    greeting: "Ciao,",
    hook: "La vostra storia di birrificio artigianale locale è un esempio concreto di innovazione nella tradizione.",
  },
  {
    to: "trattoria.sofia38@gmail.com",
    name: "Trattoria Sofia",
    slug: "trattoria-sofia",
    greeting: "Buongiorno,",
    hook: "La vostra cucina di territorio è una delle realtà che vogliamo proporre ai visitatori fuori dai circuiti mainstream.",
  },
  {
    to: "panificioroldo@gmail.com",
    name: "Panificio Roldo",
    slug: "panificio-roldo",
    greeting: "Buongiorno,",
    hook: "Il vostro panificio è un presidio locale che incarna continuità artigianale e qualità concreta.",
  },
  {
    to: "info@perliniceramicart.it",
    name: "Anna Grazia Perlini Ceramiche",
    slug: "perlini-ceramiche",
    greeting: "Gentile team,",
    hook: "La vostra ricerca artistica in ceramica è un riferimento che merita visibilità verso un pubblico internazionale qualificato.",
  },
  {
    to: "atanor@newsos.it",
    name: "Atanor",
    slug: "atanor",
    greeting: "Buongiorno,",
    hook: "Il vostro lavoro artigianale su materiali e lavorazioni tradizionali è pienamente allineato con la nostra selezione hidden gems.",
  },
  {
    to: "officina.lume@gmail.com",
    name: "Officina Lume",
    slug: "officina-lume",
    greeting: "Buongiorno,",
    hook: "La vostra storia artigianale è una delle eccellenze locali che vogliamo raccontare in modo serio e utile.",
  },
];

function buildHtml(recipient) {
  const gemUrl = `${SITE}/it/hidden-gems/${recipient.slug}`;
  return `<p>${recipient.greeting}</p>
<p>siamo il team di <a href="${SITE}"><strong>verona.guide</strong></a> — un portale turistico indipendente dedicato alla Verona autentica, quella che le guide tradizionali ignorano.</p>
<p>Il nostro progetto racconta i luoghi, le persone e le storie che rendono Verona speciale al di la dell'Arena e di Piazza Bra: artigiani, botteghe storiche, ristoranti di quartiere, produttori locali. Lo facciamo in tre lingue (italiano, inglese, tedesco) per raggiungere i turisti consapevoli che cercano esperienze vere.</p>
<p>Oltre alla guida, offriamo un servizio di <strong>itinerari personalizzati</strong> basati sulle preferenze dei visitatori e sui dati meteo e di affluenza in tempo reale — cosi ogni turista riceve un percorso su misura che include le realta come la vostra.</p>
<p><strong>${recipient.name}</strong> e gia nella nostra sezione <a href="${SITE}/it/hidden-gems">Hidden Gems</a> — la guida alle eccellenze nascoste di Verona:</p>
<p style="margin:16px 0;padding:12px 16px;background:#f8f6f2;border-left:3px solid #FFB200;"><a href="${gemUrl}" style="font-weight:bold;color:#1a1a1a;">${gemUrl}</a></p>
<p>${recipient.hook}</p>
<p>Stiamo parlando con un gruppo selezionato di esercenti veronesi per capire come il portale possa essere davvero utile al territorio. Ci farebbe molto piacere avere anche il vostro punto di vista — bastano <strong>5 minuti</strong>:</p>
<p style="margin:16px 0;"><a href="${BT_INTERVIEW_LINK}" style="display:inline-block;padding:10px 20px;background:#FFB200;color:#1a1a1a;text-decoration:none;font-weight:bold;border-radius:4px;">Partecipa all'intervista (5 min)</a></p>
<p>Se preferite, possiamo sentirci al telefono: <strong>${PHONE}</strong>.</p>
<p>Grazie per il tempo e buon lavoro,<br><strong>Il Team di <a href="${SITE}">verona.guide</a></strong></p>`;
}

async function sendEmail(recipient) {
  const html = buildHtml(recipient);
  const subject = "Siete gia su Verona.Guide: 5 minuti di intervista?";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [recipient.to],
      subject,
      html,
      reply_to: FROM_EMAIL,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`FAIL [${recipient.name}] ${recipient.to}:`, data);
    return false;
  }

  console.log(`OK   [${recipient.name}] ${recipient.to} -> id: ${data.id}`);
  return true;
}

async function main() {
  console.log(`Sending ${recipients.length} outreach emails from ${FROM_EMAIL} as '${FROM_NAME}'...\n`);

  let sent = 0;
  for (const recipient of recipients) {
    const ok = await sendEmail(recipient);
    if (ok) sent++;
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone: ${sent}/${recipients.length} sent successfully.`);
}

main().catch(console.error);
