import HeroSection from "@/components/landing/HeroSection";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { CinematicFooter } from "@/components/motion-footer";
import ExhibitList from "@/components/exhibits/ExhibitList";
import { client } from "@/sanity/lib/client";
import { ProjectHoverSectionDemo } from "@/components/Projecthoversectiondemo";
import { ProductHoverSectionDemo } from "@/components/ProductHoverSectionDemo";
import AnimatedHero from "@/components/landing/AnimatedHero";
import { ALL_EXHIBITS_QUERY } from "@/lib/sanity/queries/exhibits";
import { landingHeroQuery } from "@/lib/sanity/queries/landingHero";


export default async function Home() {
   const [exhibits, hero] = await Promise.all([
    client.fetch(ALL_EXHIBITS_QUERY),
    client.fetch(landingHeroQuery, {}, { next: { revalidate: 60 } }),
  ]);
console.log("[Home] hero is null?", hero === null);
  console.log("[Home] image count:", hero?.images?.length);
  console.log("[Home] image srcs:", hero?.images?.map((i: any) => i.src));
  console.log("[Home] headline:", hero?.headline);
  console.log("[Home] exhibits count:", exhibits?.length);


  return (
    <div className="">
      <div>
{hero && <AnimatedHero {...hero} />}
        <ProductHoverSectionDemo />
      </div>

      <div className=" [scrollbar-width:none]  ">
        <TextMask />
      </div>
      <VideoSnippets exhibits={exhibits} />
      {/* <SculpturesSnippet/> */}
      {/* <GarmentsSnippet/>     */}
      <CinematicFooter />
    </div>
  );
}
