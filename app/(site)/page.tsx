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


export default async function Home() {
    const exhibits = await client.fetch(ALL_EXHIBITS_QUERY);

  return (
    <div >
      <AnimatedHero/>
      {/* <ArtSnippet/> */}
      {/* <ExhibitList/> */}
      <ProductHoverSectionDemo/>
    <TextMask/>
<VideoSnippets exhibits={exhibits} />
      {/* <SculpturesSnippet/> */}
      {/* <GarmentsSnippet/>     */}
      <CinematicFooter/> 
    </div>
  );
}
