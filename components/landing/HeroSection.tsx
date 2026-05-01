import Preloader from "@/components/landing/Preloader";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { groq } from "next-sanity";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSectionData {
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  contactEmail: string;
  figureSvg?: { asset: { _ref: string } };
  preloaderImages?: { asset: { _ref: string }; alt?: string }[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const HERO_QUERY = groq`
  *[_type == "heroSection"][0] {
    name,
    tagline,
    subtitle,
    description,
    contactEmail,
    figureSvg,
    preloaderImages[] {
      asset,
      alt
    }
  }
`;

// ─── Fallback data (mirrors the original hard-coded values) ──────────────────

const FALLBACK: HeroSectionData = {
  name: "ManSerif.Think",
  tagline: "Art | Garments | Photographs | Sculptures",
  subtitle: "Design with Intent.",
  description:
    "Multidisciplinary artist sharing evolving work, products, and journey.",
  contactEmail: "warrenkamau.art@outlook.com",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default async function HeroSection() {
  const raw = await client
    .fetch<HeroSectionData | null>(HERO_QUERY)
    .catch(() => null);

  const data: HeroSectionData = raw ?? FALLBACK;

  // Build preloader image URL strings from Sanity asset references
  const preloaderUrls: string[] =
    data.preloaderImages
      ?.map((img) => {
        try {
          return urlFor(img).width(960).auto("format").url();
        } catch {
          return null;
        }
      })
      .filter((u): u is string => Boolean(u)) ?? [];

  // Figure SVG URL (falls back to local static file if not set in Sanity)
  const figureSrc = data.figureSvg
    ? urlFor(data.figureSvg).url()
    : "/images/manserif-man.svg";

  return (
    <div className="h-screen w-screen relative">
      <Preloader imageUrls={preloaderUrls} />

      <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#E0DCD7] pl-20 pt-24 pr-12 pb-16 md:pl-28 md:pt-32">
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-14 left-0 right-0 h-px bg-[#c9c4c4]/80" />
          <div className="absolute top-0 bottom-0 left-14 w-px bg-[#c9c4c4]/80" />
        </div>

        {/* Hero text */}
        <main className="relative max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-stone-600/90">
            {data.tagline}
          </p>
          <h1 className="mt-6 text-4xl font-medium leading-[1.12] tracking-tight text-stone-900 md:text-5xl">
            {data.name}
            <br />
            <span className="text-stone-600">{data.subtitle}</span>
          </h1>
          <p className="mt-12 max-w-[18rem] border-l border-stone-500/35 pl-5 font-mono text-sm leading-relaxed text-stone-600">
            {data.description}
          </p>
        </main>

        <a
          href={`mailto:${data.contactEmail}`}
          className="relative mt-auto font-mono text-sm text-stone-600 underline decoration-stone-400/50 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-600/60"
        >
          {data.contactEmail}
        </a>

        {/* Decorative figure — bottom-right */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          <Image
            src={figureSrc}
            alt="ManSerif figure"
            width={220}
            height={340}
            className="h-[40vh] w-auto max-h-[340px] object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
}