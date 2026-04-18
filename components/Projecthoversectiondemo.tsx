import { projects } from "@/data/projects-data";
import ProjectHoverSection from "./ui/interactive/ProjectHoverSection";

const ProjectHoverSectionDemo = () => {
  const hoverProjects = projects.map((project) => ({
    title: project.title,
    subtitle: project.subtitle,
    image: project.heroImage,
    alt: project.alt,
    slug: project.slug,
  }));

  return (
    <div id="work" className="w-full min-h-[500px] flex items-center justify-center bg-gray-200 rounded-lg py-12">
      <ProjectHoverSection projects={hoverProjects} />
    </div>
  );
};

export { ProjectHoverSectionDemo };