import { ImagesFlowDemo } from "@/components/ImagesFlowDemo";
import ArtSnippet from "@/components/landing/ArtSnippet";
import HeroSection from "@/components/landing/HeroSection";
import TextMask from "@/components/landing/TextMask";
import VideoSnippets from "@/components/landing/VideoSnippets";
import { ProjectHoverSectionDemo } from "@/components/Projecthoversectiondemo";
import { Video } from "@phosphor-icons/react";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <HeroSection/>
      <ArtSnippet/>
      <ProjectHoverSectionDemo/>
      <TextMask/>
      <VideoSnippets/>
      <ArtSnippet/>
      <ArtSnippet/>

     
    </div>
  );
}
