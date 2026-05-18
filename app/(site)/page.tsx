import ArtSnippet from "@/components/landing/ArtSnippet";
import GarmentsSnippet from "@/components/landing/GarmentsSnippet";
import HeroSection from "@/components/landing/HeroSection";
import SculpturesSnippet from "@/components/landing/SculpturesSnippet";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { CinematicFooter } from "@/components/motion-footer";
import ProjectsList from "@/components/portfolio/ProjectsList";
import { ProjectHoverSectionDemo } from "@/components/Projecthoversectiondemo";

export default function Home() {
  return (
    <div >
      <HeroSection/>
      {/* <ArtSnippet/> */}
      <ProjectsList/>
      <ProjectHoverSectionDemo/>
    <TextMask/>
      <VideoSnippets/>
      {/* <SculpturesSnippet/> */}
      {/* <GarmentsSnippet/>     */}
      <CinematicFooter/> 
    </div>
  );
}
