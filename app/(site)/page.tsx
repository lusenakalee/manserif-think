import CategoryGrid from "@/components/landing/CategoryGrid";
import GalleryScroll from "@/components/landing/GalleryScroll";
import HeroSection from "@/components/landing/HeroSection";
import SculpturesSnippet from "@/components/landing/SculpturesSnippet";
import SiteFooter from "@/components/landing/SiteFooter";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { LANDING_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ALL_EXHIBITS_QUERY } from "@/lib/sanity/queries/exhibits";
import { galleryScrollQuery } from "@/lib/sanity/queries/gallery";
import { landingHeroQuery } from "@/lib/sanity/queries/landingHero";
import { textMaskQuery } from "@/lib/sanity/queries/textMask";
import { client } from "@/sanity/lib/client";

export default async function Home() {
  const [exhibits, hero, textMask, gallery, categories] = await Promise.all([
    client.fetch(ALL_EXHIBITS_QUERY),
    client.fetch(landingHeroQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(textMaskQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(galleryScrollQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(LANDING_CATEGORIES_QUERY, {}, { next: { revalidate: 60 } }),
  ]);

  // Debug logs: remove once everything renders correctly
  console.log("[Home] hero is null?", hero === null);
  console.log("[Home] hero image count:", hero?.images?.length);
  console.log("[Home] gallery is null?", gallery === null);
  console.log("[Home] gallery image count:", gallery?.images?.length);
  console.log("[Home] category count:", categories?.length);
  console.log("[Home] exhibits count:", exhibits?.length);

  return (
    <div className="">
      <div>
        {hero && <HeroSection {...hero} interval={6000} fadeDuration={2000} />}
        <CategoryGrid categories={categories} />

        {/* <ProductHoverSectionDemo /> */}
      </div>

      <div className=" [scrollbar-width:none]  ">
        {textMask?.videoUrl && <TextMask videoUrl={textMask.videoUrl} />}
      </div>

      <VideoSnippets exhibits={exhibits} />

      <GalleryScroll {...gallery} />

      <SiteFooter />
      {/* <CinematicFooter /> */}
    </div>
  );
}