import data from "./data/hidden-gems.json";

export interface HiddenGem {
  slug: string;
  name: string;
  category: string;
  area: string;
  description_it: string;
  description_en: string;
  description_de: string;
}

export type SupportedLang = "it" | "en" | "de";

const gems = data as HiddenGem[];

export function getAllGems(): HiddenGem[] {
  return gems;
}

export function getGemBySlug(slug: string): HiddenGem | undefined {
  return gems.find((g) => g.slug === slug);
}

export function getDescription(gem: HiddenGem, lang: SupportedLang): string {
  return gem[`description_${lang}`];
}

export function getAllSlugs(): string[] {
  return gems.map((g) => g.slug);
}

export const SUPPORTED_LANGS: SupportedLang[] = ["it", "en", "de"];
