import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getGemBySlug,
  getDescription,
  getAllSlugs,
  SUPPORTED_LANGS,
  type SupportedLang,
} from "@/lib/hidden-gems";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return SUPPORTED_LANGS.flatMap((lang) =>
    slugs.map((slug) => ({ lang, slug }))
  );
}

const BREADCRUMB: Record<SupportedLang, { home: string; section: string }> = {
  it: { home: "Home", section: "Hidden Gems" },
  en: { home: "Home", section: "Hidden Gems" },
  de: { home: "Home", section: "Hidden Gems" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const gem = getGemBySlug(slug);
  if (!gem) return {};
  const l = lang as SupportedLang;
  const desc = getDescription(gem, l);
  return {
    title: gem.name,
    description: desc,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LANGS.map((lng) => [lng, `/${lng}/hidden-gems/${gem.slug}`])
      ),
    },
  };
}

export default async function GemDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const gem = getGemBySlug(slug);
  if (!gem) notFound();

  const l = lang as SupportedLang;
  const description = getDescription(gem, l);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: gem.name,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: gem.area,
      addressCountry: "IT",
    },
    url: `https://verona.guide/${l}/hidden-gems/${gem.slug}`,
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0E0904", color: "#F5F0E8" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
              href={`/${lng}/hidden-gems/${gem.slug}`}
              className="text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              {lng.toUpperCase()}
            </a>
          ))}
        </nav>
      </header>

      {/* Breadcrumb */}
      <nav
        className="px-6 md:px-12 pt-6 pb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-40"
        style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}
      >
        <a href={`/${l}`} className="hover:opacity-100 transition-opacity">
          {BREADCRUMB[l].home}
        </a>
        <span>/</span>
        <a
          href={`/${l}/hidden-gems`}
          className="hover:opacity-100 transition-opacity"
        >
          {BREADCRUMB[l].section}
        </a>
        <span>/</span>
        <span style={{ color: "#BAFF29" }}>{gem.name}</span>
      </nav>

      {/* Content */}
      <main className="px-6 md:px-12 pt-10 pb-20 max-w-4xl mx-auto">
        {/* Category + area */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 700,
              color: "#FFB200",
              letterSpacing: "0.16em",
            }}
          >
            {gem.category}
          </span>
          <span
            className="text-[10px] uppercase tracking-widest opacity-40"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 600,
            }}
          >
            {gem.area}
          </span>
        </div>

        {/* H1 */}
        <h1
          className="text-[clamp(36px,6vw,84px)] leading-none uppercase mb-8"
          style={{
            fontFamily: "var(--font-barlow), 'Arial Narrow', sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            color: "#F5F0E8",
          }}
        >
          {gem.name}
        </h1>

        {/* Placeholder image */}
        <div
          className="w-full mb-10"
          style={{
            aspectRatio: "21/9",
            background: "rgba(245,240,232,0.04)",
            borderTop: "1px solid rgba(245,240,232,0.08)",
            borderBottom: "1px solid rgba(245,240,232,0.08)",
          }}
        />

        {/* Description */}
        <p
          className="text-lg leading-relaxed max-w-2xl"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            opacity: 0.8,
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>

        {/* Back link */}
        <div
          className="mt-16 pt-8"
          style={{ borderTop: "1px solid rgba(245,240,232,0.08)" }}
        >
          <a
            href={`/${l}/hidden-gems`}
            className="text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#BAFF29",
            }}
          >
            ← {BREADCRUMB[l].section}
          </a>
        </div>
      </main>
    </div>
  );
}
