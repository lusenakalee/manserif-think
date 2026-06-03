import HeroSection from "@/components/landing/HeroSection";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { CinematicFooter } from "@/components/motion-footer";
import ExhibitList from "@/components/exhibits/ExhibitList";
import { ProjectHoverSectionDemo } from "@/components/Projecthoversectiondemo";
import { ProductHoverSectionDemo } from "@/components/ProductHoverSectionDemo";
import AnimatedHero from "@/components/landing/AnimatedHero";

export default function Home() {
  return (
    <div >
      <AnimatedHero/>
      {/* <ArtSnippet/> */}
      <ExhibitList/>
      <ProductHoverSectionDemo/>
    <TextMask/>
      <VideoSnippets/>
      {/* <SculpturesSnippet/> */}
      {/* <GarmentsSnippet/>     */}
      <CinematicFooter/> 
    </div>
  );
}
