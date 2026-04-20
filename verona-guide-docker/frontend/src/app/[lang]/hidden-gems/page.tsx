import type { Metadata } from "next";
import {
  getAllGems,
  getDescription,
  SUPPORTED_LANGS,
  type SupportedLang,
} from "@/lib/hidden-gems";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

const PAGE_TITLE: Record<SupportedLang, string> = {
  it: "Hidden Gems di Verona",
  en: "Hidden Gems of Verona",
  de: "Hidden Gems von Verona",
};

const PAGE_SUBTITLE: Record<SupportedLang, string> = {
  it: "Quaranta luoghi autentici lontani dalla rotta turistica. Selezionati per chi vuole la vera Verona.",
  en: "Forty authentic places off the tourist track. Curated for those who want the real Verona.",
  de: "Vierzig authentische Orte abseits der Touristenroute. Ausgewählt für alle, die das echte Verona suchen.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as SupportedLang;
  return {
    title: PAGE_TITLE[l],
    description: PAGE_SUBTITLE[l],
    alternates: {
      languages: {
        it: "/it/hidden-gems",
        en: "/en/hidden-gems",
        de: "/de/hidden-gems",
      },
    },
  };
}

export default async function HiddenGemsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as SupportedLang;
  const gems = getAllGems();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0E0904", color: "#F5F0E8" }}
    >
      {/* Header nav */}
      <header
        className="px-6 md:px-12 py-6 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(245,240,232,0.08)" }}
      >
        <a
          href={`/${l}`}
          className="text-sm tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          Verona<span style={{ color: "#FFB200" }}>.</span>Guide
        </a>
        <nav className="flex items-center gap-4">
          {SUPPORTED_LANGS.filter((lng) => lng !== l).map((lng) => (
            <a
              key={lng}
              href={`/${lng}/hidden-gems`}
              className="text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              {lng.toUpperCase()}
            </a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-12">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-4 opacity-40"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              letterSpacing: "0.18em",
              color: "#BAFF29",
            }}
          >
            Hidden Gems
          </p>
          <h1
            className="text-[clamp(48px,8vw,120px)] leading-none tracking-tight uppercase mb-6"
            style={{
              fontFamily: "var(--font-barlow), 'Arial Narrow', sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
            }}
          >
            <span style={{ color: "#F5F0E8" }}>
              {PAGE_TITLE[l].split(" ").slice(0, -1).join(" ")}
            </span>{" "}
            <span style={{ color: "#BAFF29" }}>
              {PAGE_TITLE[l].split(" ").at(-1)}
            </span>
          </h1>
          <p
            className="max-w-xl text-sm leading-relaxed opacity-50"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {PAGE_SUBTITLE[l]}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px"
          style={{ background: "rgba(245,240,232,0.06)" }}
        >
          {gems.map((gem) => {
            const desc = getDescription(gem, l);
            const excerpt = desc.length > 110 ? desc.slice(0, 107) + "…" : desc;
            return (
              <a
                key={gem.slug}
                href={`/${l}/hidden-gems/${gem.slug}`}
                className="group flex flex-col p-6 transition-all duration-300"
                style={{ background: "#0E0904" }}
              >
                {/* Placeholder image area */}
                <div
                  className="w-full mb-4 relative overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    background: "rgba(245,240,232,0.04)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "rgba(186,255,41,0.05)" }}
                  />
                  <div
                    className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest opacity-20"
                    style={{
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: 700,
                      color: "#BAFF29",
                    }}
                  >
                    {gem.area}
                  </div>
                </div>

                {/* Category tag */}
                <span
                  className="text-[10px] uppercase tracking-widest mb-2 opacity-60"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 700,
                    color: "#FFB200",
                    letterSpacing: "0.14em",
                  }}
                >
                  {gem.category}
                </span>

                {/* Name */}
                <h2
                  className="text-base font-bold leading-tight mb-3 group-hover:opacity-100 opacity-90 transition-opacity"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 700,
                    color: "#F5F0E8",
                  }}
                >
                  {gem.name}
                </h2>

                {/* Description excerpt */}
                <p
                  className="text-xs leading-relaxed opacity-50 flex-1"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {excerpt}
                </p>

                {/* Area */}
                <div
                  className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-30"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: "#F5F0E8" }}>{gem.area}</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
