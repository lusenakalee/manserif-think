import HeroSection from "@/components/landing/HeroSection";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { CinematicFooter } from "@/components/motion-footer";
import ExhibitList from "@/components/exhibits/ExhibitList";
import { ProjectHoverSectionDemo } from "@/components/Projecthoversectiondemo";

export default function Home() {
  return (
    <div >
      <HeroSection/>
      {/* <ArtSnippet/> */}
      <ExhibitList/>
      <ProjectHoverSectionDemo/>
    <TextMask/>
      <VideoSnippets/>
      {/* <SculpturesSnippet/> */}
      {/* <GarmentsSnippet/>     */}
      <CinematicFooter/> 
    </div>
  );
}
